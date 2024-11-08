<template>
  <div class="profile-container">
    <h2>User Profile</h2>

    <form @submit.prevent="saveProfile" class="profile-form">
      <div v-if="error" class="message error">{{ error }}</div>
      <div v-if="successMessage" class="message success">
        {{ successMessage }}
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          placeholder="Enter your name"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          placeholder="Enter your email"
          required
          type="email"
          :disabled="loading"
        />
      </div>

      <div class="button-group">
        <button type="submit" :disabled="loading || !isDirty" class="primary">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>

        <button
          @click="logout"
          type="button"
          :disabled="loading"
          class="secondary"
        >
          {{ loading ? 'Logging out...' : 'Logout' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosError } from 'axios'
import axios from '../axios'
import { auth } from '../firebaseConfig'
import { signOut } from 'firebase/auth'
import { isTokenValid } from '../utils'

interface UserProfile {
  name: string
  email: string
}

interface ProfileData {
  name: string
  email: string
  loading: boolean
  error: string
  successMessage: string
  isDirty: boolean
}

export default defineComponent({
  data(): ProfileData {
    return {
      name: '',
      email: '',
      loading: false,
      error: '',
      successMessage: '',
      isDirty: false,
    }
  },
  created() {
    this.fetchProfile()
  },
  watch: {
    name() {
      this.isDirty = true
    },
    email() {
      this.isDirty = true
    },
  },
  methods: {
    async fetchProfile() {
      this.loading = true
      this.error = ''

      try {
        const token = localStorage.getItem('userToken')
        if (!token || !isTokenValid(token)) {
          this.$router.push('/')
          return
        }

        const response = await axios.get<UserProfile>('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.name = response.data.name
        this.email = response.data.email
        this.isDirty = false
      } catch (err) {
        const error = err as AxiosError<{ message: string }>
        this.error = error.response?.data?.message || 'Failed to fetch profile'
        console.error('Error fetching profile:', error)
      } finally {
        this.loading = false
      }
    },
    async saveProfile() {
      if (!this.isDirty) return

      this.loading = true
      this.error = ''
      this.successMessage = ''

      try {
        const token = localStorage.getItem('userToken')
        if (!token || !isTokenValid(token)) { throw new Error('Not authenticated') }

        await axios.put<UserProfile>(
          '/api/profile',
          { name: this.name, email: this.email },
          { headers: { Authorization: `Bearer ${token}` } },
        )

        this.successMessage = 'Profile updated successfully'
        this.isDirty = false
      } catch (err) {
        const error = err as AxiosError<{ message: string }>
        this.error = error.response?.data?.message || 'Failed to save profile'
        console.error('Error saving profile:', error)
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      try {
        await signOut(auth)
        localStorage.removeItem('userToken') // Clear any stored tokens
        this.$router.push('/') //Redirect to login page
      } catch (error) {
        console.error('Error during logout:', error)
        this.error = 'Failed to logout. Please try again.'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef5350;
}

.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #66bb6a;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  flex: 1;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.primary {
  background-color: #4caf50;
  color: white;
}

.secondary {
  background-color: #f44336;
  color: white;
}

label {
  font-weight: 500;
}
</style>
