package com.shilpa.kala.fragments.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.addCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.shilpa.kala.R
import com.shilpa.kala.databinding.FragmentHomeBinding
import com.shilpa.kala.utils.SessionManager
import com.shilpa.kala.utils.Extensions.showToast

import androidx.recyclerview.widget.LinearLayoutManager
import com.shilpa.kala.adapters.ProductAdapter
import com.shilpa.kala.data.database.AppDatabase
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var db: AppDatabase
    private lateinit var productAdapter: ProductAdapter
    private lateinit var categoryAdapter: CategoryAdapter

    private val categories = listOf(
        com.shilpa.kala.adapters.Category(
            "Channapatna Toys", "Channapatna", "https://img.etimg.com/thumb/msid-77983656,width-1200,height-900,resizemode-4,imgsize-293774/channapatna-toys.jpg",
            "A 200-year-old heritage craft encouraged by Tipu Sultan who invited Persian artisans to teach the locals. GI tagged.",
            "Safe for children as they use non-toxic vegetable dyes.",
            "Ivory Wood (Aale Mara), Lacquer, vegetable colors.",
            "Hand-turning on a lathe (Khiraadi), finishing with screw-pine leaf.",
            "Spinning tops, math games, rocking horses, dolls"
        ),
        com.shilpa.kala.adapters.Category(
            "Bidriware", "Bidar", "https://karnatakatourism.org/wp-content/uploads/2020/06/bidri-work-1.jpg",
            "Originated in the 14th century during the Bahmani Sultanate, blending Persian and local styles.",
            "The unique soil of Bidar Fort is used to turn the metal black.",
            "Zinc, Copper, Pure Silver wire/sheets.",
            "Casting, engraving, silver inlay, blackening with Bidar soil.",
            "Vases, bowls, jewelry boxes, hookahs"
        ),
        com.shilpa.kala.adapters.Category(
            "Rosewood Inlay", "Mysuru", "https://mysticalpalaces.com/wp-content/uploads/2021/04/Rosewood-Inlay-Work-Mysore-1024x683.jpg",
            "Popularized by the Wodeyar kings, these artifacts depict Mysore Dussehra and royal scenery.",
            "Meticulous assembly of multiple wood types to create colorful patterns.",
            "Rosewood, Ebony, Teak, and colorful wood pieces.",
            "Cutting, chiseling, embedding wood pieces.",
            "Wall hangings, furniture parts, decorative plates"
        ),
        com.shilpa.kala.adapters.Category(
            "Sandalwood Carving", "Mysuru", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Sandalwood-Carving.jpg",
            "Sandalwood is the state tree of Karnataka; practicing generations of artisans.",
            "Unique for its fragrance and extreme detail.",
            "Santalum album (Sandalwood).",
            "Intricate hand-carving using fine steel tools.",
            "Deity statues, fans, incense holders, boxes"
        ),
        com.shilpa.kala.adapters.Category(
            "Ilkal Sarees", "Ilkal", "https://i.pinimg.com/736x/f6/af/4d/f6af4dac1c695b28d0873be74c3558fe.jpg",
            "Centuries-old handloom tradition, known for its unique Tope Teni pallu joining.",
            "A symbol of North Karnataka's rich weaving heritage.",
            "Cotton, Silk, Art-silk.",
            "Loom-weaving, Tope Teni (pallu-joining).",
            "Ilkal Sarees, fabrics, traditional drapes"
        ),
        com.shilpa.kala.adapters.Category(
            "Yakshagana Gear", "Udupi", "https://karnatakatourism.org/wp-content/uploads/2019/05/Yakshagana_Udupi_Tourism.jpg",
            "Yakshagana is a traditional theater form combining mythology, dance, and music.",
            "Preserves the folk art and mythology of coastal Karnataka.",
            "Wood, mirror work, colored stones, pith, gold foil.",
            "Bannike (painting), Pagade (headgear making).",
            "Kirita (Crowns), Kavacha (Breastplates), ornaments"
        ),
        com.shilpa.kala.adapters.Category(
            "Kinnal Dolls", "Kinnal, Koppal", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Kinhal-toys.jpg",
            "Handed down from the Vijayanagara Empire artisans who worked on the Hampi temples.",
            "The paste called 'Lajakara' used for bonding is a unique secret formula.",
            "Pith and tamarind seed paste, light wood.",
            "Hand-carving, applying paste, watercolor painting.",
            "Traditional dolls, Gauri-Ganesha idols"
        ),
        com.shilpa.kala.adapters.Category(
            "Kasuti Work", "Dharwad", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Kasuti-Embroidery.jpg",
            "Originated in the Chalukya period, traditionally practiced by women.",
            "Tedious form of hand embroidery that looks identical on both sides.",
            "Cotton thread, vibrant silk fabrics.",
            "Ganti (knot), Murgi (zigzag), Neygi (running stitch).",
            "Embroidered sarees, cushion covers, kurtas"
        ),
        com.shilpa.kala.adapters.Category(
            "Stone Carving", "Shivarapatna", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Stone-Carving.jpg",
            "Influenced by the Hoysala and Kadamba architectural styles.",
            "Follows ancient Shilpa Shastra ancient science for proportions.",
            "Soapstone, Black granite.",
            "Chiseling, polishing, detailed microscopic carving.",
            "Temple idols, decorative pillars"
        ),
        com.shilpa.kala.adapters.Category(
            "Bronze Craft", "Udupi", "https://shilpakalaacademy.org/wp-content/uploads/2021/01/Metal-Bronze-Craft.jpg",
            "Udupi is center for Pancha Loha casting for temple icons.",
            "The Lost Wax technique used ensures each piece is unique.",
            "Copper, Zinc, Lead, Tin, Silver.",
            "Lost-wax casting, hammering, fine engraving.",
            "Temple bells, lamps (Deepas), idols"
        )
    )

    private val selectImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            val action = HomeFragmentDirections.actionHomeFragmentToPreviewFragment(it.toString())
            findNavController().navigate(action)
        }
    }

    private val requestPermissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[android.Manifest.permission.CAMERA] ?: false
        val storageGranted = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            permissions[android.Manifest.permission.READ_MEDIA_IMAGES] ?: false
        } else {
            permissions[android.Manifest.permission.READ_EXTERNAL_STORAGE] ?: false
        }

        if (cameraGranted || storageGranted) {
            showImageSourceOptions()
        } else {
            requireContext().showToast("Permissions are required to upload photos")
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        sessionManager = SessionManager(requireContext())
        db = AppDatabase.getDatabase(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.toolbar.setNavigationOnClickListener {
            showExitConfirmation()
        }

        binding.toolbar.setOnMenuItemClickListener { item ->
            when (item.itemId) {
                R.id.action_profile -> {
                    findNavController().navigate(R.id.action_homeFragment_to_profileFragment)
                    true
                }
                else -> false
            }
        }

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            showExitConfirmation()
        }

        binding.tvWelcome.text = "Welcome, ${sessionManager.getUserName() ?: "Artisan"}"

        setupRecyclerView()
        loadProducts()

        binding.btnCapture.setOnClickListener {
            checkPermissionsAndShowOptions()
        }

        binding.btnUpload.setOnClickListener {
            checkPermissionsAndShowOptions()
        }

        binding.btnGallery.setOnClickListener {
            findNavController().navigate(R.id.action_homeFragment_to_galleryFragment)
        }

        binding.btnAddCollection.setOnClickListener {
            findNavController().navigate(R.id.action_homeFragment_to_addCollectionFragment)
        }
    }

    private fun setupRecyclerView() {
        categoryAdapter = CategoryAdapter(categories) { category ->
            val action = HomeFragmentDirections.actionHomeFragmentToCraftDetailFragment(category)
            findNavController().navigate(action)
        }
        binding.rvCategories.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = categoryAdapter
        }

        productAdapter = ProductAdapter(
            products = emptyList(),
            currentUserId = sessionManager.getUserId(),
            onProductClick = { product ->
                val action = HomeFragmentDirections.actionHomeFragmentToProductDetailFragment(product.id)
                findNavController().navigate(action)
            }
        )
        binding.rvRecent.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = productAdapter
        }
    }

    private fun loadProducts() {
        lifecycleScope.launch {
            val uid = sessionManager.getUserId() ?: ""
            var list = db.productDao().getProductsByOwner(uid)
            
            if (list.isEmpty()) {
                // Seed database for first-time demo
                val dummyProducts = listOf(
                    com.shilpa.kala.models.Product(
                        name = "Bidriware Vase",
                        category = "Bidriware",
                        woodType = "Zinc & Copper",
                        price = 3500.0,
                        description = "Exquisite metal handicraft from Bidar with intricate silver inlay work. A unique blend of Persian and local art.",
                        artisanName = "Mansoor Artisan",
                        artisanLocation = "Bidar, Karnataka",
                        artisanContact = "919000000000",
                        materials = "Zinc, Copper, Silver",
                        imageUrl = "https://karnatakatourism.org/wp-content/uploads/2020/06/bidri-work-1.jpg",
                        brandedImageUrl = "",
                        timestamp = System.currentTimeMillis(),
                        ownerId = uid
                    ),
                    com.shilpa.kala.models.Product(
                        name = "Channapatna Horse",
                        category = "Channapatna Toys",
                        woodType = "Aale Mara Wood",
                        price = 1200.0,
                        description = "Traditional lacware toy made with natural vegetable dyes. Perfectly safe for children and heritage lovers.",
                        artisanName = "Sidda Setty",
                        artisanLocation = "Channapatna, Karnataka",
                        artisanContact = "919111111111",
                        materials = "Ivory Wood, Natural Lac",
                        imageUrl = "https://img.etimg.com/thumb/msid-77983656,width-1200,height-900,resizemode-4,imgsize-293774/channapatna-toys.jpg",
                        brandedImageUrl = "",
                        timestamp = System.currentTimeMillis(),
                        ownerId = uid
                    ),
                    com.shilpa.kala.models.Product(
                        name = "Rosewood Elephant",
                        category = "Rosewood Inlay",
                        woodType = "Mysore Rosewood",
                        price = 5500.0,
                        description = "Handcrafted elephant with multi-wood inlay patterns depicting royal procession.",
                        artisanName = "Suresh Inlay Worker",
                        artisanLocation = "Mysuru, Karnataka",
                        artisanContact = "919222222222",
                        materials = "Rosewood, Ebony",
                        imageUrl = "https://mysticalpalaces.com/wp-content/uploads/2021/04/Rosewood-Inlay-Work-Mysore-1024x683.jpg",
                        brandedImageUrl = "",
                        timestamp = System.currentTimeMillis(),
                        ownerId = uid
                    )
                )
                dummyProducts.forEach { db.productDao().insertProduct(it) }
                list = db.productDao().getProductsByOwner(uid)
            }
            productAdapter.updateList(list)
        }
    }

    private fun checkPermissionsAndShowOptions() {
        val permissions = mutableListOf(android.Manifest.permission.CAMERA)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            permissions.add(android.Manifest.permission.READ_MEDIA_IMAGES)
        } else {
            permissions.add(android.Manifest.permission.READ_EXTERNAL_STORAGE)
        }

        val allGranted = permissions.all {
            androidx.core.content.ContextCompat.checkSelfPermission(requireContext(), it) == android.content.pm.PackageManager.PERMISSION_GRANTED
        }

        if (allGranted) {
            showImageSourceOptions()
        } else {
            requestPermissionsLauncher.launch(permissions.toTypedArray())
        }
    }

    private fun showImageSourceOptions() {
        val options = arrayOf("Take Photo", "Choose from Gallery", "Cancel")
        com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Select Image Source")
            .setItems(options) { dialog, which ->
                when (which) {
                    0 -> findNavController().navigate(R.id.action_homeFragment_to_cameraFragment)
                    1 -> selectImageLauncher.launch("image/*")
                    2 -> dialog.dismiss()
                }
            }
            .show()
    }

    private fun showExitConfirmation() {
        com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext(), R.style.CustomAlertDialog)
            .setTitle("Exit Shilpa-Kala?")
            .setMessage("Are you sure you want to exit the application?")
            .setPositiveButton("Exit") { _, _ ->
                requireActivity().finish()
            }
            .setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
