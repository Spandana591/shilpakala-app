package com.shilpa.kala.data.database

import androidx.room.*
import com.shilpa.kala.models.User
import com.shilpa.kala.models.Product

@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): User?

    @Query("SELECT * FROM users WHERE uid = :uid LIMIT 1")
    suspend fun getUserById(uid: String): User?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: User)
}

@Dao
interface ProductDao {
    @Query("SELECT * FROM products WHERE ownerId = :userId ORDER BY timestamp DESC")
    suspend fun getProductsByOwner(userId: String): List<Product>

    @Query("SELECT * FROM products ORDER BY timestamp DESC")
    suspend fun getAllProducts(): List<Product>

    @Query("SELECT * FROM products WHERE id = :id LIMIT 1")
    suspend fun getProductById(id: Long): Product?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProduct(product: Product)

    @Update
    suspend fun updateProduct(product: Product)

    @Query("UPDATE products SET isFavorite = :isFavorite WHERE id = :productId")
    suspend fun updateFavorite(productId: Long, isFavorite: Boolean)

    @Query("SELECT * FROM products WHERE isFavorite = 1")
    suspend fun getFavoriteProducts(): List<Product>

    @Delete
    suspend fun deleteProduct(product: Product)
}

@Dao
interface InquiryDao {
    @Insert
    suspend fun insertInquiry(inquiry: BuyerInquiry)

    @Query("SELECT * FROM inquiries ORDER BY timestamp DESC")
    suspend fun getAllInquiries(): List<BuyerInquiry>
}

@Database(entities = [User::class, Product::class, BuyerInquiry::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun productDao(): ProductDao
    abstract fun inquiryDao(): InquiryDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: android.content.Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "shilpa_kala_db"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
