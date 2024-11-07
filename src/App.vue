<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <h1 class="app-title">Natural Cycles Challenge</h1>
      <div class="wrapper">
        <nav class="navigation">
          <RouterLink class="nav-link" to="/">Login</RouterLink>
          <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.app-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
}

.navigation {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #333;
}

.nav-link.router-link-exact-active {
  color: #42b883;
  font-weight: 600;
  background-color: rgba(66, 184, 131, 0.1);
}

.main-content {
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
}

@media (min-width: 768px) {
  header {
    padding: 1.5rem 4rem;
  }

  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navigation {
    margin-top: 0;
  }

  .app-title {
    font-size: 2rem;
  }

  .main-content {
    padding: 0 4rem;
  }
}
</style>
