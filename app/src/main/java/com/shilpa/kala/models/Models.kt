package com.shilpa.kala.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class User(
    @PrimaryKey val uid: String,
    val name: String = "",
    val email: String = "",
    val artisanType: String = "",
    val profileImage: String = ""
)

@Entity(tableName = "products")
data class Product(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String = "",
    val category: String = "",
    val woodType: String = "",
    val price: Double = 0.0,
    val description: String = "",
    val artisanName: String = "",
    val artisanBio: String = "Traditional Karnataka artisan preserving heritage crafts.",
    val artisanLocation: String = "Karnataka, India",
    val artisanContact: String = "919876543210",
    val imageUrl: String = "",
    val brandedImageUrl: String = "",
    val timestamp: Long = System.currentTimeMillis(),
    val ownerId: String = "",
    val isFavorite: Boolean = false,
    val materials: String = "Natural dyes, Ivory wood",
    val craftType: String = "Handmade Lacware",
    val isAvailable: Boolean = true
)

@Entity(tableName = "inquiries")
data class BuyerInquiry(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val productId: Long,
    val productTitle: String,
    val buyerName: String,
    val buyerPhone: String,
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)
