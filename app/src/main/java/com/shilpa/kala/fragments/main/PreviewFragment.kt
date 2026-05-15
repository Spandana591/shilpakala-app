package com.shilpa.kala.fragments.main

import android.graphics.*
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.shilpa.kala.R
import com.shilpa.kala.data.database.AppDatabase
import com.shilpa.kala.databinding.FragmentPreviewBinding
import com.shilpa.kala.models.Product
import com.shilpa.kala.utils.Extensions.showToast
import com.shilpa.kala.utils.SessionManager
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

class PreviewFragment : Fragment() {
    private var _binding: FragmentPreviewBinding? = null
    private val binding get() = _binding!!
    private val args: PreviewFragmentArgs by navArgs()
    private lateinit var db: AppDatabase
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentPreviewBinding.inflate(inflater, container, false)
        db = AppDatabase.getDatabase(requireContext())
        sessionManager = SessionManager(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            findNavController().popBackStack()
        }

        val imageUri = Uri.parse(args.imageUri)
        binding.ivPreview.setImageURI(imageUri)

        binding.btnBack.setOnClickListener {
            findNavController().popBackStack()
        }

        binding.btnSave.setOnClickListener {
            val name = binding.etProductName.text.toString()
            if (name.isEmpty()) {
                requireContext().showToast("Please enter product name")
                return@setOnClickListener
            }
            processAndSaveImage(imageUri, name)
        }
    }

    private fun processAndSaveImage(originalUri: Uri, productName: String) {
        val bitmap = MediaStore.Images.Media.getBitmap(requireContext().contentResolver, originalUri)
        val mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true)
        val canvas = Canvas(mutableBitmap)

        val paint = Paint().apply {
            color = Color.WHITE
            textSize = 50f
            alpha = 180
            isAntiAlias = true
        }

        // Add Watermark
        canvas.drawText("Shilpa-Kala Handmade", 50f, mutableBitmap.height - 100f, paint)
        
        // Add "Handmade in Karnataka" Badge
        val badgePaint = Paint().apply {
            color = Color.parseColor("#8D6E63") // Brown
            style = Paint.Style.FILL
        }
        canvas.drawRect(mutableBitmap.width - 400f, 50f, mutableBitmap.width - 50f, 150f, badgePaint)
        paint.textSize = 30f
        canvas.drawText("KARNATAKA HERITAGE", mutableBitmap.width - 380f, 110f, paint)

        // Save branded image locally
        val brandedFile = File(requireContext().filesDir, "branded_${System.currentTimeMillis()}.jpg")
        FileOutputStream(brandedFile).use { out ->
            mutableBitmap.compress(Bitmap.CompressFormat.JPEG, 90, out)
        }

        // Save metadata to Room
        val product = Product(
            id = UUID.randomUUID().toString(),
            name = productName,
            imageUrl = originalUri.toString(),
            brandedImageUrl = Uri.fromFile(brandedFile).toString(),
            ownerId = sessionManager.getUserId() ?: "unknown",
            timestamp = System.currentTimeMillis()
        )

        lifecycleScope.launch {
            db.productDao().insertProduct(product)
            requireContext().showToast("Product saved locally!")
            findNavController().navigate(R.id.action_previewFragment_to_homeFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
