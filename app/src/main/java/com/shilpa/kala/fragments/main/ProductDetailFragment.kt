package com.shilpa.kala.fragments.main

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.bumptech.glide.Glide
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.shilpa.kala.R
import com.shilpa.kala.data.database.AppDatabase
import com.shilpa.kala.databinding.DialogInquiryBinding
import com.shilpa.kala.databinding.FragmentProductDetailBinding
import com.shilpa.kala.models.BuyerInquiry
import com.shilpa.kala.models.Product
import com.shilpa.kala.utils.Extensions.showToast
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ProductDetailFragment : Fragment() {

    private var _binding: FragmentProductDetailBinding? = null
    private val binding get() = _binding!!
    private val args: ProductDetailFragmentArgs by navArgs()
    private lateinit var db: AppDatabase
    private var currentProduct: Product? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductDetailBinding.inflate(inflater, container, false)
        db = AppDatabase.getDatabase(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        loadProductDetails()
        setupListeners()
    }

    private fun loadProductDetails() {
        lifecycleScope.launch {
            val product = db.productDao().getProductById(args.productId)
            if (product != null) {
                currentProduct = product
                bindDetails(product)
            } else {
                requireContext().showToast("Collection item not found")
                findNavController().navigateUp()
            }
        }
    }

    private fun bindDetails(product: Product) {
        binding.tvProductNameMain.text = product.name
        binding.tvCategoryTag.text = product.category.uppercase()
        binding.tvPriceMain.text = "₹ ${String.format("%,.0f", product.price)}"
        binding.tvDescriptionMain.text = product.description
        binding.tvArtisanNameMain.text = product.artisanName
        binding.tvArtisanLocationMain.text = product.artisanLocation
        binding.tvArtisanBio.text = product.artisanBio
        binding.tvMaterials.text = product.materials
        binding.tvLocation.text = product.artisanLocation.split(",").first()
        binding.tvCraftType.text = product.craftType
        
        val sdf = SimpleDateFormat("MMMM yyyy", Locale.getDefault())
        binding.tvUploadDate.text = sdf.format(Date(product.timestamp))

        binding.tvAvailability.text = if (product.isAvailable) "In Stock" else "Sold Out"
        binding.tvAvailability.setTextColor(if (product.isAvailable) 0xFF43A047.toInt() else 0xFFE53935.toInt())

        Glide.with(this)
            .load(product.imageUrl)
            .placeholder(android.R.drawable.ic_menu_gallery)
            .error(android.R.drawable.ic_menu_report_image)
            .into(binding.ivProductMain)

        updateFavoriteUI(product.isFavorite)
    }

    private fun updateFavoriteUI(isFavorite: Boolean) {
        binding.ivFavorite.setImageResource(
            if (isFavorite) android.R.drawable.btn_star_big_on else android.R.drawable.btn_star_big_off
        )
    }

    private fun setupListeners() {
        binding.toolbar.setNavigationOnClickListener { findNavController().navigateUp() }

        binding.btnFavorite.setOnClickListener {
            currentProduct?.let { product ->
                val newState = !product.isFavorite
                lifecycleScope.launch {
                    db.productDao().updateFavorite(product.id, newState)
                    currentProduct = product.copy(isFavorite = newState)
                    updateFavoriteUI(newState)
                    val msg = if (newState) "Saved to collection" else "Removed from favorites"
                    requireContext().showToast(msg)
                }
            }
        }

        binding.btnWhatsApp.setOnClickListener {
            contactArtisanViaWhatsApp()
        }

        binding.btnInterestedToBuy.setOnClickListener {
            showInquiryDialog()
        }

        binding.btnShareMain.setOnClickListener {
            shareProduct()
        }
    }

    private fun contactArtisanViaWhatsApp() {
        val product = currentProduct ?: return
        val phoneNumber = product.artisanContact
        val message = "Hello, I am interested in your handicraft product '${product.name}' from Shilpa-Kala."
        
        try {
            val url = "https://api.whatsapp.com/send?phone=$phoneNumber&text=${Uri.encode(message)}"
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse(url)
            startActivity(intent)
        } catch (e: Exception) {
            requireContext().showToast("WhatsApp is not installed on this device.")
        }
    }

    private fun shareProduct() {
        val product = currentProduct ?: return
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, "Artisan Collection: ${product.name}")
            putExtra(Intent.EXTRA_TEXT, "Look at this exquisite '${product.name}' handcrafted by ${product.artisanName}. Found it on Shilpa-Kala!")
        }
        startActivity(Intent.createChooser(shareIntent, "Share Collection Item"))
    }

    private fun showInquiryDialog() {
        val dialogBinding = DialogInquiryBinding.inflate(layoutInflater)
        val dialog = MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setView(dialogBinding.root)
            .create()

        dialogBinding.btnCancelInquiry.setOnClickListener { dialog.dismiss() }

        dialogBinding.btnSendInquiry.setOnClickListener {
            val name = dialogBinding.etBuyerName.text.toString().trim()
            val phone = dialogBinding.etBuyerPhone.text.toString().trim()
            val message = dialogBinding.etBuyerMessage.text.toString().trim()

            if (name.isEmpty() || phone.isEmpty()) {
                requireContext().showToast("Please enter name and phone")
                return@setOnClickListener
            }

            if (phone.length < 10) {
                requireContext().showToast("Invalid phone number")
                return@setOnClickListener
            }

            saveInquiry(name, phone, message, dialog)
        }

        dialog.show()
    }

    private fun saveInquiry(name: String, phone: String, message: String, dialog: androidx.appcompat.app.AlertDialog) {
        val product = currentProduct ?: return
        lifecycleScope.launch {
            try {
                val inquiry = BuyerInquiry(
                    productId = product.id,
                    productTitle = product.name,
                    buyerName = name,
                    buyerPhone = phone,
                    message = message
                )
                db.inquiryDao().insertInquiry(inquiry)
                dialog.dismiss()
                requireContext().showToast("Your interest has been sent successfully.")
            } catch (e: Exception) {
                requireContext().showToast("Request failed: ${e.message}")
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
