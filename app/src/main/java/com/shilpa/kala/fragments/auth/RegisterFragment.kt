package com.shilpa.kala.fragments.auth

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.addCallback
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.lifecycle.lifecycleScope
import com.shilpa.kala.R
import com.shilpa.kala.data.database.AppDatabase
import com.shilpa.kala.databinding.FragmentRegisterBinding
import com.shilpa.kala.models.User
import com.shilpa.kala.utils.Extensions.showToast
import kotlinx.coroutines.launch
import java.util.UUID

class RegisterFragment : Fragment() {
    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!
    private lateinit var db: AppDatabase

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
        db = AppDatabase.getDatabase(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            findNavController().navigate(R.id.action_registerFragment_to_loginFragment)
        }

        binding.btnRegister.setOnClickListener {
            val name = binding.etName.text.toString()
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()
            val confirmPassword = binding.etConfirmPassword.text.toString()

            if (name.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
                requireContext().showToast("Please fill all fields")
                return@setOnClickListener
            }

            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                requireContext().showToast("Invalid email format")
                return@setOnClickListener
            }

            if (password.length < 6) {
                requireContext().showToast("Password too short (min 6 chars)")
                return@setOnClickListener
            }

            if (password != confirmPassword) {
                requireContext().showToast("Passwords do not match")
                return@setOnClickListener
            }

            binding.progressBar.visibility = View.VISIBLE
            binding.btnRegister.isEnabled = false

            lifecycleScope.launch {
                val existingUser = db.userDao().getUserByEmail(email)
                binding.progressBar.visibility = View.GONE
                binding.btnRegister.isEnabled = true

                if (existingUser != null) {
                    requireContext().showToast("Email already exists")
                } else {
                    val uid = UUID.randomUUID().toString()
                    val user = User(uid, name, email)
                    db.userDao().insertUser(user)
                    requireContext().showToast("Success! Please Login")
                    findNavController().navigate(R.id.action_registerFragment_to_loginFragment)
                }
            }
        }

        binding.tvLogin.setOnClickListener {
            findNavController().navigate(R.id.action_registerFragment_to_loginFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
