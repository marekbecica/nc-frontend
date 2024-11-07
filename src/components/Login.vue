<template>
  <div class="login-container">
    <h2>Login</h2>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent>
      <div id="recaptcha-container"></div>

      <div class="input-group">
        <input
          v-model="phoneNumber"
          type="tel"
          placeholder="Enter phone number (e.g., +46701234567)"
          :disabled="loading"
          pattern="^\+?[1-9]\d{1,14}$"
        />
      </div>

      <div v-if="!confirmationResult" class="button-group">
        <button @click="sendOTP" :disabled="loading || !phoneNumber">
          {{ loading ? 'Sending...' : 'Send verification code' }}
        </button>
      </div>

      <div v-else class="input-group">
        <input
          v-model="otp"
          type="text"
          placeholder="Enter OTP"
          :disabled="loading"
          maxlength="6"
          pattern="[0-9]*"
        />
        <button @click="verifyOTP" :disabled="loading || !otp">
          {{ loading ? 'Verifying...' : 'Verify code' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { auth } from '../firebaseConfig'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import type { ConfirmationResult } from 'firebase/auth'
interface LoginData {
  phoneNumber: string
  otp: string
  confirmationResult: ConfirmationResult | null
  loading: boolean
  error: string | null
}

export default defineComponent({
  data(): LoginData {
    return {
      phoneNumber: '',
      otp: '',
      confirmationResult: null,
      loading: false,
      error: null,
    }
  },
  methods: {
    async sendOTP() {
      this.loading = true
      this.error = null
      console.log(this.phoneNumber)
      try {
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            },
          },
        )

        this.confirmationResult = await signInWithPhoneNumber(
          auth,
          this.phoneNumber,
          recaptchaVerifier,
        )
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'Failed to send OTP'
        console.error('Error sending OTP:', error)
      } finally {
        this.loading = false
      }
    },
    async verifyOTP() {
      if (!this.confirmationResult) return

      this.loading = true
      this.error = null

      try {
        const result = await this.confirmationResult.confirm(this.otp)
        const token = await result.user.getIdToken()
        localStorage.setItem('userToken', token)
        this.$router.push('/profile')
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'Failed to verify OTP'
        console.error('Error verifying OTP:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
