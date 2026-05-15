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
import com.shilpa.kala.databinding.FragmentLoginBinding
import com.shilpa.kala.utils.Extensions.showToast
import com.shilpa.kala.utils.SessionManager
import kotlinx.coroutines.launch

class LoginFragment : Fragment() {
    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!
    private lateinit var db: AppDatabase
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        db = AppDatabase.getDatabase(requireContext())
        sessionManager = SessionManager(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.toolbar.setNavigationOnClickListener {
            requireActivity().finish()
        }

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            requireActivity().finish()
        }

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                requireContext().showToast("Please fill all fields")
                return@setOnClickListener
            }

            binding.progressBar.visibility = View.VISIBLE
            binding.btnLogin.isEnabled = false

            lifecycleScope.launch {
                val email = binding.etEmail.text.toString()
                val password = binding.etPassword.text.toString()
                
                if (email.isEmpty() || password.isEmpty()) {
                    binding.progressBar.visibility = View.GONE
                    binding.btnLogin.isEnabled = true
                    requireContext().showToast("Please fill all fields")
                    return@launch
                }

                val user = db.userDao().getUserByEmail(email)
                binding.progressBar.visibility = View.GONE
                binding.btnLogin.isEnabled = true
                
                if (user != null) {
                    sessionManager.saveLoginSession(user.uid, user.name)
                    requireContext().showToast("Welcome back, ${user.name}!")
                    findNavController().navigate(R.id.action_loginFragment_to_homeFragment)
                } else {
                    requireContext().showToast("Invalid credentials or user not found.")
                }
            }
        }

        binding.tvSignUp.setOnClickListener {
            findNavController().navigate(R.id.action_loginFragment_to_registerFragment)
        }

        binding.tvForgotPassword.setOnClickListener {
            findNavController().navigate(R.id.action_loginFragment_to_forgotPasswordFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
