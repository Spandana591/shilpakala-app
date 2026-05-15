package com.shilpa.kala.fragments.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.google.android.material.chip.Chip
import com.shilpa.kala.adapters.Category
import com.shilpa.kala.adapters.CategoryAdapter
import com.shilpa.kala.databinding.FragmentCraftDetailBinding

class CraftDetailFragment : Fragment() {
    private var _binding: FragmentCraftDetailBinding? = null
    private val binding get() = _binding!!
    private val args: CraftDetailFragmentArgs by navArgs()

    private val allCategories = listOf(
        "Channapatna Toys", "Bidriware", "Rosewood Inlay", "Sandalwood Carving", 
        "Ilkal Sarees", "Yakshagana Gear", "Kinnal Dolls", "Kasuti Work", 
        "Stone Carving", "Bronze Craft"
    )

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentCraftDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            findNavController().popBackStack()
        }

        val category = args.category
        setupUI(category)
        setupRelatedCrafts(category)
    }

    private fun setupUI(category: Category) {
        binding.tvCraftName.text = category.name
        binding.tvLocation.text = category.location
        binding.tvHistory.text = category.history
        binding.tvImportance.text = category.importance
        binding.tvMaterials.text = category.materials
        binding.tvTechniques.text = category.techniques

        Glide.with(this)
            .load(category.imageUrl)
            .placeholder(android.R.drawable.ic_menu_gallery)
            .error(android.R.drawable.ic_menu_report_image)
            .into(binding.ivCraft)

        binding.toolbar.setNavigationOnClickListener {
            findNavController().popBackStack()
        }

        binding.chipGroupProducts.removeAllViews()
        category.products.split(",").forEach { productName ->
            if (productName.isNotBlank()) {
                val chip = Chip(requireContext()).apply {
                    text = productName.trim()
                }
                binding.chipGroupProducts.addView(chip)
            }
        }

        binding.btnUploadSimilar.setOnClickListener {
            findNavController().navigate(R.id.action_craftDetailFragment_to_cameraFragment)
        }

        binding.btnShare.setOnClickListener {
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_SUBJECT, "Artisanal Heritage: ${category.name}")
                putExtra(Intent.EXTRA_TEXT, "Did you know about the heritage of ${category.name}, from ${category.location}? Check out the history and techniques on Shilpa-Kala App! #ShilpaKala #KarnatakaHeritage")
            }
            startActivity(Intent.createChooser(shareIntent, "Share the Artisanal Story"))
        }

        binding.btnExploreMarket.setOnClickListener {
            findNavController().navigate(R.id.action_craftDetailFragment_to_galleryFragment)
        }
    }

    private fun setupRelatedCrafts(current: Category) {
        // Related crafts logic
        val relatedItems = listOf(
            Category("Bidriware", "Bidar", "https://karnatakatourism.org/wp-content/uploads/2020/06/bidri-work-1.jpg", 
                techniques = "Silver Inlay", history = "Bahmani Sultanate origins"),
            Category("Sandalwood", "Mysuru", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Sandalwood-Carving.jpg",
                techniques = "Fine Carving", history = "State tree of Karnataka"),
            Category("Kinnal Dolls", "Kinnal", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Kinhal-toys.jpg",
                techniques = "Secret Bond Formula", history = "Vijayanagara Legacy")
        ).filter { it.name != current.name }

        val relatedAdapter = CategoryAdapter(relatedItems) { category ->
            val action = CraftDetailFragmentDirections.actionCraftDetailFragmentSelf(category)
            findNavController().navigate(action)
        }
        
        binding.rvRelatedCrafts.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = relatedAdapter
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
