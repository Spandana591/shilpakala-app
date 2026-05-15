package com.shilpa.kala.fragments.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.shilpa.kala.R
import com.shilpa.kala.databinding.FragmentProfileBinding
import com.shilpa.kala.utils.SessionManager

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        sessionManager = SessionManager(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }

        val userName = sessionManager.getUserName() ?: "Artisan"
        binding.tvName.text = userName
        binding.tvInitials.text = userName.firstOrNull()?.uppercase() ?: "A"

        binding.btnSettings.setOnClickListener {
            findNavController().navigate(R.id.action_profileFragment_to_settingsFragment)
        }

        binding.btnLogout.setOnClickListener {
            sessionManager.logout()
            findNavController().navigate(R.id.action_loginFragment_to_homeFragment) // This will trigger re-auth check or go to login if in root
            requireActivity().finish() // Simple exit for demo
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
