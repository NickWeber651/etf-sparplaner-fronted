<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSparplaene, deleteSparplan, type SparplanResponse } from '../services/sparplanApi'

// --- Sparpläne State ---
const sparplaeneLoading = ref(false)
const sparplaeneError = ref<string | null>(null)
const sparplaene = ref<SparplanResponse[]>([])

// Inline-Confirm State
const confirmDeleteId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

function requestDelete(id: number) {
  confirmDeleteId.value = id
}

function cancelDelete() {
  confirmDeleteId.value = null
}

async function confirmDelete(id: number) {
  sparplaeneError.value = null
  deletingId.value = id

  try {
    await deleteSparplan(id)
    sparplaene.value = sparplaene.value.filter(p => p.id !== id)
    confirmDeleteId.value = null
  } catch (e: unknown) {
    sparplaeneError.value =
      e instanceof Error ? (e.message || 'Fehler beim Löschen des Sparplans') : 'Fehler beim Löschen des Sparplans'
  } finally {
    deletingId.value = null
  }
}

async function loadSparplaene() {
  sparplaeneLoading.value = true
  sparplaeneError.value = null

  try {
    sparplaene.value = await getSparplaene()
  } catch (e: unknown) {
    sparplaeneError.value =
      e instanceof Error ? (e.message || 'Fehler beim Laden der Sparpläne') : 'Fehler beim Laden der Sparpläne'
  } finally {
    sparplaeneLoading.value = false
  }
}

onMounted(async () => {
  await loadSparplaene()
})
</script>

<template>
  <section class="page">
    <header class="header">
      <div>
        <h2 class="title">Gespeicherte Sparpläne</h2>
        <p class="subtitle">Hier kannst du deine gespeicherten Sparpläne verwalten (inkl. Löschen).</p>
      </div>

      <button class="btn btn-secondary" type="button" @click="loadSparplaene" :disabled="sparplaeneLoading">
        Aktualisieren
      </button>
    </header>

    <div v-if="sparplaeneLoading" class="hint">
      <span class="spinner" aria-hidden="true"></span>
      Lade gespeicherte Sparpläne ...
    </div>

    <div v-else-if="sparplaeneError" class="alert">
      <strong>Fehler:</strong> {{ sparplaeneError }}
    </div>

    <div v-else>
      <p v-if="sparplaene.length === 0" class="hint">
        Noch keine Sparpläne gespeichert.
      </p>

      <ul v-else class="sparplan-list">
        <li v-for="p in sparplaene" :key="p.id" class="sparplan-item">
          <div class="sparplan-main">
            <div class="sparplan-title">
              <strong>{{ p.etfName }}</strong>
              <span class="chip">#{{ p.id }}</span>
            </div>

            <div class="sparplan-meta">
              <span><span class="label">Rate:</span> {{ p.monatlicheRate }} €</span>
              <span class="dot">•</span>
              <span><span class="label">Laufzeit:</span> {{ p.laufzeitJahre }} Jahre</span>
              <span class="dot">•</span>
              <span><span class="label">Erstellt:</span> {{ p.erstelltAm }}</span>
            </div>
          </div>

          <div class="actions">
            <template v-if="confirmDeleteId === p.id">
              <button
                class="btn btn-secondary btn-small"
                type="button"
                @click="cancelDelete"
                :disabled="deletingId === p.id"
              >
                Abbrechen
              </button>

              <button
                class="btn btn-danger btn-small"
                type="button"
                @click="confirmDelete(p.id)"
                :disabled="deletingId === p.id"
              >
                <span v-if="deletingId === p.id" class="spinner" aria-hidden="true"></span>
                <span v-else>Wirklich löschen</span>
              </button>
            </template>

            <button
              v-else
              class="btn btn-danger-outline btn-icon"
              type="button"
              @click="requestDelete(p.id)"
              aria-label="Sparplan löschen"
              title="Löschen"
            >
              🗑️
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Layout */
.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 1rem 0.5rem;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.title {
  margin: 0;
  font-size: 1.4rem;
}

.subtitle {
  margin: 0.35rem 0 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #9ca3af;
  padding: 0.75rem 0;
}

.alert {
  border: 1px solid rgba(220, 38, 38, 0.35);
  background: rgba(220, 38, 38, 0.08);
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 10px;
}

/* List */
.sparplan-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.sparplan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(229, 231, 235, 0.12);
  background: rgba(17, 24, 39, 0.55);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.sparplan-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e5e7eb;
}

.chip {
  font-size: 0.8rem;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
}

.sparplan-meta {
  margin-top: 0.35rem;
  color: #cbd5e1;
  font-size: 0.92rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.label {
  color: #94a3b8;
}

.dot {
  opacity: 0.6;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Buttons */
.btn {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.08s ease, background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  user-select: none;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 0.45rem 0.75rem;
  font-size: 0.92rem;
}

.btn-icon {
  width: 42px;
  height: 42px;
  padding: 0;
  display: grid;
  place-items: center;
  border-radius: 999px;
}

/* Variants */
.btn-secondary {
  background: rgba(229, 231, 235, 0.12);
  border-color: rgba(229, 231, 235, 0.15);
  color: #e5e7eb;
}
.btn-secondary:hover {
  background: rgba(229, 231, 235, 0.18);
}

.btn-danger {
  background: rgba(220, 38, 38, 0.9);
  color: white;
}
.btn-danger:hover {
  background: rgba(185, 28, 28, 0.95);
}

.btn-danger-outline {
  background: transparent;
  border-color: rgba(220, 38, 38, 0.45);
  color: #fca5a5;
}
.btn-danger-outline:hover {
  background: rgba(220, 38, 38, 0.12);
  border-color: rgba(220, 38, 38, 0.65);
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(229, 231, 235, 0.35);
  border-top-color: rgba(229, 231, 235, 0.95);
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
