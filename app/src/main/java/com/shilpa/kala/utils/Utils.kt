package com.shilpa.kala.utils

import android.content.Context
import android.widget.Toast

object Extensions {
    fun Context.showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}

object Constants {
    const val USERS_COLLECTION = "users"
    const val PRODUCTS_COLLECTION = "products"
    const val PRODUCTS_STORAGE = "products_images"
}
