package com.shilpa.kala.fragments.main

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import androidx.lifecycle.lifecycleScope
import com.shilpa.kala.R
import com.shilpa.kala.adapters.ProductAdapter
import com.shilpa.kala.data.database.AppDatabase
import com.shilpa.kala.databinding.DialogEditProductBinding
import com.shilpa.kala.databinding.FragmentGalleryBinding
import com.shilpa.kala.models.Product
import com.shilpa.kala.utils.Extensions.showToast
import com.shilpa.kala.utils.SessionManager
import kotlinx.coroutines.launch

import com.google.android.material.snackbar.Snackbar

class GalleryFragment : Fragment() {
    private var _binding: FragmentGalleryBinding? = null
    private val binding get() = _binding!!
    private lateinit var db: AppDatabase
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: ProductAdapter
    private var allProducts = listOf<Product>()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentGalleryBinding.inflate(inflater, container, false)
        db = AppDatabase.getDatabase(requireContext())
        sessionManager = SessionManager(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            findNavController().popBackStack()
        }

        setupRecyclerView()
        fetchProducts()
        setupSearch()

        binding.toolbar.setNavigationOnClickListener { findNavController().popBackStack() }
    }

    private fun setupRecyclerView() {
        adapter = ProductAdapter(
            products = emptyList(),
            currentUserId = sessionManager.getUserId(),
            onEditClick = { product -> showEditDialog(product) },
            onDeleteClick = { product -> showDeleteConfirmation(product) },
            onShareClick = { product -> shareProduct(product) },
            onProductClick = { product ->
                val action = GalleryFragmentDirections.actionGalleryFragmentToProductDetailFragment(product.id)
                findNavController().navigate(action)
            }
        )
        binding.rvGallery.layoutManager = GridLayoutManager(requireContext(), 2)
        binding.rvGallery.adapter = adapter
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterProducts(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun filterProducts(query: String) {
        val filtered = allProducts.filter { 
            it.name.contains(query, ignoreCase = true) || 
            it.category.contains(query, ignoreCase = true) 
        }
        adapter.updateList(filtered)
        binding.tvEmpty.visibility = if (filtered.isEmpty()) View.VISIBLE else View.GONE
    }

    private fun fetchProducts() {
        val uid = sessionManager.getUserId() ?: return
        lifecycleScope.launch {
            allProducts = db.productDao().getProductsByOwner(uid)
            adapter.updateList(allProducts)
            binding.tvEmpty.visibility = if (allProducts.isEmpty()) View.VISIBLE else View.GONE
        }
    }

    private fun showEditDialog(product: Product) {
        if (sessionManager.getUserId() == "guest_user") {
            showUnauthorizedPopup()
            return
        }
        
        val dialogBinding = DialogEditProductBinding.inflate(layoutInflater)
        dialogBinding.etName.setText(product.name)
        dialogBinding.etCategory.setText(product.category)
        dialogBinding.etPrice.setText(product.price.toString())
        dialogBinding.etDescription.setText(product.description)

        com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Edit Artisan Work")
            .setView(dialogBinding.root)
            .setPositiveButton("Save") { dialog, _ ->
                val newName = dialogBinding.etName.text.toString()
                val newCategory = dialogBinding.etCategory.text.toString()
                val newPrice = dialogBinding.etPrice.text.toString().toDoubleOrNull() ?: product.price
                val newDesc = dialogBinding.etDescription.text.toString()

                if (newName.isBlank()) {
                    requireContext().showToast("Name cannot be empty")
                    return@setPositiveButton
                }

                lifecycleScope.launch {
                    val updatedProduct = product.copy(
                        name = newName,
                        category = newCategory,
                        price = newPrice,
                        description = newDesc,
                        timestamp = System.currentTimeMillis()
                    )
                    db.productDao().updateProduct(updatedProduct)
                    requireContext().showToast("Gallery updated successfully")
                    fetchProducts()
                }
            }
            .setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
            .show()
    }

    private fun showDeleteConfirmation(product: Product) {
        if (sessionManager.getUserId() == "guest_user") {
            showUnauthorizedPopup()
            return
        }

        com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Delete Masterpiece?")
            .setMessage("Are you sure you want to remove '${product.name}'? This action cannot be undone.")
            .setPositiveButton("Delete") { _, _ ->
                lifecycleScope.launch {
                    try {
                        db.productDao().deleteProduct(product)
                        requireContext().showToast("Collection deleted successfully")
                        fetchProducts()
                    } catch (e: Exception) {
                        requireContext().showToast("Error: ${e.message}")
                    }
                }
            }
            .setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
            .show()
    }

    private fun showUnauthorizedPopup() {
        com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Unauthorized Access")
            .setMessage("You are not authorized to modify this collection. Please login with your artisan account.")
            .setPositiveButton("I Understand") { dialog, _ -> dialog.dismiss() }
            .show()
    }

    private fun shareProduct(product: Product) {
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, "Check out my handcrafted masterpiece: ${product.name}! Created using Shilpa-Kala App.")
            type = "text/plain"
        }
        startActivity(Intent.createChooser(shareIntent, "Share Product Via"))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
