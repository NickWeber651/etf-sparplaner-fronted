<script setup lang="ts">
const modules = [
  { id: 1, name: 'M1 – Backend-Grundlagen', done: true },
  { id: 2, name: 'M2 – Vue-Unterkomponente mit v-for', done: false },
  { id: 3, name: 'M3 – REST / API-Anbindung', done: false }
]
</script>

<template>
  <section>
    <h2>Unsere WebTech-Meilensteine</h2>
    <ul>
      <!-- genau hier erfüllst du die M2-Anforderung: v-for -->
      <li v-for="m in modules" :key="m.id">
        {{ m.name }}
        <span v-if="m.done"> ✅ erledigt</span>
        <span v-else> ⏳ in Arbeit</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 0.5rem;
}
ul {
  padding-left: 1.2rem;
}
li {
  margin: 0.25rem 0;
}
</style>
