<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSparplaene, deleteSparplan, updateSparplan, type SparplanResponse, type SparplanRequest } from '../services/sparplanApi'

// Inline-Edit State
const editingId = ref<number | null>(null)
const savingId = ref<number | null>(null)
const editForm = ref<SparplanRequest>({
  etfName: '',
  monatlicheRate: 0,
  laufzeitJahre: 0,
})

const sparplaene = ref<SparplanResponse[]>([])
const sparplaeneError = ref<string | null>(null)
const confirmDeleteId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

function startEdit(plan: SparplanResponse) {
  // Wenn gerade eine Delete-Confirmation offen ist, schließen
  confirmDeleteId.value = null

  editingId.value = plan.id
  editForm.value = {
    etfName: plan.etfName,
    monatlicheRate: plan.monatlicheRate,
    laufzeitJahre: plan.laufzeitJahre,
  }
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(id: number) {
  sparplaeneError.value = null
  savingId.value = id

  try {
    const updated = await updateSparplan(id, editForm.value)
    sparplaene.value = sparplaene.value.map(p => (p.id === id ? updated : p))
    editingId.value = null
  } catch (e: unknown) {
    sparplaeneError.value =
      e instanceof Error ? (e.message || 'Fehler beim Bearbeiten des Sparplans') : 'Fehler beim Bearbeiten des Sparplans'
  } finally {
    savingId.value = null
  }
}

function requestDelete(id: number) {
  // Wenn gerade ein Edit offen ist, schließen
  editingId.value = null
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

onMounted(async () => {
  try {
    sparplaene.value = await getSparplaene()
  } catch (e: unknown) {
    sparplaeneError.value =
      e instanceof Error ? (e.message || 'Fehler beim Laden der Sparpläne') : 'Fehler beim Laden der Sparpläne'
  }
})
</script>

<template>
  <section class="saved-plans">
    <h2>Gespeicherte Sparpläne</h2>

    <p v-if="sparplaeneError" class="error">{{ sparplaeneError }}</p>

    <ul v-if="sparplaene.length" class="plans-grid">
      <li v-for="p in sparplaene" :key="p.id" class="plan-card" role="listitem" :aria-label="`Sparplan ${p.etfName}`">
        <div class="plan-header">
          <h3>{{ p.etfName }}</h3>
          <span class="plan-id">ID: {{ p.id }}</span>
        </div>

        <div class="plan-details">
          <div class="detail-item">
            <span class="label">Monatliche Rate</span>
            <span class="value">{{ p.monatlicheRate }} €</span>
          </div>
          <div class="detail-item">
            <span class="label">Laufzeit</span>
            <span class="value">{{ p.laufzeitJahre }} Jahre</span>
          </div>
        </div>

        <div v-if="editingId === p.id" class="edit-panel">
          <label class="edit-field">
            <span class="edit-label">ETF</span>
            <input class="edit-input" v-model="editForm.etfName" type="text" />
          </label>

          <label class="edit-field">
            <span class="edit-label">Monatliche Rate (€)</span>
            <input class="edit-input" v-model.number="editForm.monatlicheRate" type="number" min="25" max="10000" step="1" />
          </label>

          <label class="edit-field">
            <span class="edit-label">Laufzeit (Jahre)</span>
            <input class="edit-input" v-model.number="editForm.laufzeitJahre" type="number" min="1" max="60" step="1" />
          </label>
        </div>

        <div class="actions">
          <template v-if="editingId === p.id">
            <button class="secondary small" type="button" @click="cancelEdit" :disabled="savingId === p.id">
              Abbrechen
            </button>

            <button class="danger small" type="button" @click="saveEdit(p.id)" :disabled="savingId === p.id">
              <span v-if="savingId === p.id" class="spinner" aria-hidden="true"></span>
              <span v-else>Speichern</span>
            </button>
          </template>

          <template v-else-if="confirmDeleteId === p.id">
            <button class="secondary small" type="button" @click="cancelDelete" :disabled="deletingId === p.id">
              Abbrechen
            </button>

            <button class="danger small" type="button" @click="confirmDelete(p.id)" :disabled="deletingId === p.id">
              <span v-if="deletingId === p.id" class="spinner" aria-hidden="true"></span>
              <span v-else>Wirklich löschen</span>
            </button>
          </template>

          <template v-else>
            <button class="icon" type="button" @click="startEdit(p)" aria-label="Sparplan bearbeiten" title="Bearbeiten">✏️</button>
            <button class="icon danger-outline" type="button" @click="requestDelete(p.id)" aria-label="Sparplan löschen" title="Löschen">🗑️</button>
          </template>
        </div>
      </li>
    </ul>

    <p v-else class="empty-state">
      Keine gespeicherten Sparpläne gefunden.
    </p>
  </section>
</template>

<style scoped>
.saved-plans {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.saved-plans h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #41b883;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.plan-header h3 {
  font-size: 1rem;
  margin: 0;
  color: var(--color-heading);
  flex: 1;
  line-height: 1.3;
}

.plan-id {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.5;
  font-weight: 500;
  margin-left: 0.5rem;
}

.plan-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.detail-item .label {
  color: var(--color-text);
  opacity: 0.75;
}

.detail-item .value {
  font-weight: 600;
  color: var(--color-heading);
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

button.icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem 0.5rem;
  color: var(--color-text);
  border-radius: 0.35rem;
  transition: background-color 0.2s ease;
}

button.icon:hover {
  background-color: rgba(65, 184, 131, 0.15);
  color: #41b883;
}

button.icon.danger-outline {
  color: #e74c3c;
}

button.icon.danger-outline:hover {
  background-color: rgba(231, 76, 60, 0.15);
}

button.secondary {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text);
  transition: background-color 0.2s ease;
}

button.secondary:hover:not(:disabled) {
  background-color: rgba(65, 184, 131, 0.15);
  border-color: #41b883;
  color: #41b883;
}

button.danger {
  background-color: #e74c3c;
  border: none;
  border-radius: 0.5rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: white;
  transition: background-color 0.2s ease;
}

button.danger:hover:not(:disabled) {
  background-color: #c0392b;
}

button.small {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Edit panel styles */
.edit-panel {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

.edit-field {
  display: grid;
  gap: 0.35rem;
}

.edit-label {
  font-size: 0.8rem;
  color: #94a3b8;
}

.edit-input {
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(229, 231, 235, 0.18);
  background: rgba(17, 24, 39, 0.35);
  color: #e5e7eb;
  outline: none;
}

.edit-input:focus {
  border-color: rgba(65, 184, 131, 0.65);
  box-shadow: 0 0 0 3px rgba(65, 184, 131, 0.18);
}

@media (max-width: 700px) {
  .edit-panel {
    grid-template-columns: 1fr;
  }
}
</style>
