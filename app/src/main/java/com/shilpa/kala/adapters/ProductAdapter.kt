package com.shilpa.kala.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.DiffUtil
import com.bumptech.glide.Glide
import com.shilpa.kala.databinding.ItemProductBinding
import com.shilpa.kala.models.Product

class ProductAdapter(
    private var products: List<Product>,
    private val currentUserId: String? = null,
    private val onEditClick: ((Product) -> Unit)? = null,
    private val onDeleteClick: ((Product) -> Unit)? = null,
    private val onShareClick: ((Product) -> Unit)? = null,
    private val onProductClick: (Product) -> Unit
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    inner class ProductViewHolder(val binding: ItemProductBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = products[position]
        holder.binding.tvName.text = product.name
        holder.binding.tvCategory.text = product.category.ifEmpty { "HANDCRAFTED" }
        holder.binding.tvArtisan.text = "By ${product.artisanName.ifEmpty { "Artisan" }}"
        holder.binding.tvPrice.text = "₹${product.price}"
        
        Glide.with(holder.itemView.context)
            .load(product.brandedImageUrl.ifEmpty { product.imageUrl })
            .placeholder(android.R.drawable.ic_menu_gallery)
            .error(android.R.drawable.ic_menu_report_image)
            .centerCrop()
            .into(holder.binding.ivProduct)

        // Show actions (always visible for collection management, check auth in fragment)
        holder.binding.layoutActions.visibility = if (onEditClick != null) View.VISIBLE else View.GONE

        holder.binding.btnShare.setOnClickListener { onShareClick?.invoke(product) }
        holder.binding.btnEdit.setOnClickListener { onEditClick?.invoke(product) }
        holder.binding.btnDelete.setOnClickListener { onDeleteClick?.invoke(product) }
        holder.itemView.setOnClickListener { onProductClick(product) }
    }

    override fun getItemCount() = products.size

    fun updateList(newList: List<Product>) {
        val diffResult = DiffUtil.calculateDiff(ProductDiffCallback(products, newList))
        products = newList
        diffResult.dispatchUpdatesTo(this)
    }

    class ProductDiffCallback(
        private val oldList: List<Product>,
        private val newList: List<Product>
    ) : DiffUtil.Callback() {
        override fun getOldListSize(): Int = oldList.size
        override fun getNewListSize(): Int = newList.size
        override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
            return oldList[oldItemPosition].id == newList[newItemPosition].id
        }
        override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
            return oldList[oldItemPosition] == newList[newItemPosition]
        }
    }
}
