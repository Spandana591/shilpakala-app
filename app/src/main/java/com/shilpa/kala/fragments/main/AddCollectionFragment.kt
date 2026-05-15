package com.shilpa.kala.fragments.main

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.activity.addCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.shilpa.kala.R
import com.shilpa.kala.data.database.AppDatabase
import com.shilpa.kala.databinding.FragmentAddCollectionBinding
import com.shilpa.kala.models.Product
import com.shilpa.kala.utils.Extensions.showToast
import com.shilpa.kala.utils.SessionManager
import kotlinx.coroutines.launch
import java.util.UUID

class AddCollectionFragment : Fragment() {

    private var _binding: FragmentAddCollectionBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var db: AppDatabase
    private lateinit var sessionManager: SessionManager
    private var selectedImageUri: Uri? = null

    private val categories = listOf(
        "Channapatna Toys",
        "Bidriware",
        "Rosewood Inlay",
        "Sandalwood Carving",
        "Ilkal Sarees",
        "Yakshagana Gear",
        "Kinnal Dolls",
        "Kasuti Work",
        "Stone Carving",
        "Bronze Craft"
    )

    private val selectImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            handleImageSelection(it)
        }
    }

    private val takePhotoLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val imageUri = result.data?.data
            if (imageUri != null) {
                handleImageSelection(imageUri)
            } else {
                val bitmap = result.data?.extras?.get("data") as? android.graphics.Bitmap
                bitmap?.let {
                    // Convert bitmap to URI for consistency
                    val path = MediaStore.Images.Media.insertImage(requireContext().contentResolver, it, "shilpa_kala_${System.currentTimeMillis()}", null)
                    handleImageSelection(Uri.parse(path))
                }
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAddCollectionBinding.inflate(inflater, container, false)
        db = AppDatabase.getDatabase(requireContext())
        sessionManager = SessionManager(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupUI()
        setupListeners()
        setupBackNavigation()
    }

    private fun setupUI() {
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_dropdown_item_1line, categories)
        binding.autoCategory.setAdapter(adapter)
    }

    private fun setupListeners() {
        binding.toolbar.setNavigationOnClickListener {
            handleBackPress()
        }

        binding.cardImage.setOnClickListener {
            showImageSourceOptions()
        }

        binding.btnRemoveImage.setOnClickListener {
            selectedImageUri = null
            binding.ivProduct.setImageResource(android.R.drawable.ic_menu_gallery)
            binding.ivProduct.imageTintList = null
            binding.layoutUploadHint.visibility = View.VISIBLE
            binding.btnRemoveImage.visibility = View.GONE
            binding.tvFileName.visibility = View.GONE
        }

        binding.btnSave.setOnClickListener {
            validateAndSave()
        }

        binding.btnCancel.setOnClickListener {
            handleBackPress()
        }
    }

    private fun setupBackNavigation() {
        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            handleBackPress()
        }
    }

    private fun handleBackPress() {
        if (hasUnsavedChanges()) {
            showDiscardDialog()
        } else {
            findNavController().navigateUp()
        }
    }

    private fun hasUnsavedChanges(): Boolean {
        return binding.etProductName.text?.isNotEmpty() == true ||
                binding.etDescription.text?.isNotEmpty() == true ||
                binding.etPrice.text?.isNotEmpty() == true ||
                selectedImageUri != null
    }

    private fun showDiscardDialog() {
        MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Discard Changes?")
            .setMessage("You have unsaved changes. Are you sure you want to leave?")
            .setPositiveButton("Leave") { _, _ ->
                findNavController().navigateUp()
            }
            .setNegativeButton("Stay") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }

    private fun showImageSourceOptions() {
        val options = arrayOf("Take Photo", "Choose from Gallery", "Cancel")
        MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Select Image Source")
            .setItems(options) { dialog, which ->
                when (which) {
                    0 -> {
                        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                        takePhotoLauncher.launch(intent)
                    }
                    1 -> selectImageLauncher.launch("image/*")
                    2 -> dialog.dismiss()
                }
            }
            .show()
    }

    private fun handleImageSelection(uri: Uri) {
        selectedImageUri = uri
        binding.ivProduct.setImageURI(uri)
        binding.layoutUploadHint.visibility = View.GONE
        binding.btnRemoveImage.visibility = View.VISIBLE
        binding.tvFileName.visibility = View.VISIBLE
        binding.tvFileName.text = "Image Selected"
    }

    private fun validateAndSave() {
        val name = binding.etProductName.text.toString().trim()
        val category = binding.autoCategory.text.toString().trim()
        val artisan = binding.etArtisanName.text.toString().trim()
        val priceStr = binding.etPrice.text.toString().trim()
        val description = binding.etDescription.text.toString().trim()

        if (name.isEmpty()) {
            binding.tilProductName.error = "Name is required"
            return
        } else binding.tilProductName.error = null

        if (category.isEmpty()) {
            binding.tilCategory.error = "Category is required"
            return
        } else binding.tilCategory.error = null

        if (priceStr.isEmpty()) {
            binding.tilPrice.error = "Price is required"
            return
        } else binding.tilPrice.error = null

        if (selectedImageUri == null) {
            requireContext().showToast("Please upload an image")
            return
        }

        val price = priceStr.toDoubleOrNull()
        if (price == null || price <= 0) {
            binding.tilPrice.error = "Invalid price"
            return
        } else binding.tilPrice.error = null

        saveToDatabase(name, category, artisan, price, description)
    }

    private fun saveToDatabase(name: String, category: String, artisan: String, price: Double, description: String) {
        lifecycleScope.launch {
            try {
                val userId = sessionManager.getUserId() ?: ""
                val product = Product(
                    name = name,
                    category = category,
                    price = price,
                    description = description,
                    artisanName = artisan,
                    imageUrl = selectedImageUri.toString(),
                    ownerId = userId,
                    timestamp = System.currentTimeMillis()
                )

                db.productDao().insertProduct(product)
                requireContext().showToast("Collection added successfully")
                findNavController().navigate(R.id.action_addCollectionFragment_to_galleryFragment)
            } catch (e: Exception) {
                requireContext().showToast("Failed to save collection: ${e.message}")
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
