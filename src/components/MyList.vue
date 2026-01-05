<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getSparplaene,
  deleteSparplan,
  updateSparplan,
  type SparplanResponse,
  type SparplanRequest,
} from '../services/sparplanApi'

// --- State ---
const loading = ref(false)
const error = ref<string | null>(null)
const sparplaene = ref<SparplanResponse[]>([])

// --- Inline-Edit State ---
const editingId = ref<number | null>(null)
const savingId = ref<number | null>(null)
const editForm = ref<SparplanRequest>({
  etfName: '',
  monatlicheRate: 0,
  laufzeitJahre: 0,
})

// --- Inline-Delete-Confirm State ---
const confirmDeleteId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

async function loadSparplaene() {
  loading.value = true
  error.value = null
  try {
    sparplaene.value = await getSparplaene()
  } catch (e: unknown) {
    error.value = e instanceof Error ? (e.message || 'Fehler beim Laden der Sparpläne') : 'Fehler beim Laden der Sparpläne'
  } finally {
    loading.value = false
  }
}

// --- Edit ---
function startEdit(p: SparplanResponse) {
  confirmDeleteId.value = null
  editingId.value = p.id
  editForm.value = {
    etfName: p.etfName,
    monatlicheRate: p.monatlicheRate,
    laufzeitJahre: p.laufzeitJahre,
  }
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(id: number) {
  error.value = null
  savingId.value = id

  try {
    const updated = await updateSparplan(id, editForm.value)
    sparplaene.value = sparplaene.value.map(p => (p.id === id ? updated : p))
    editingId.value = null
  } catch (e: unknown) {
    error.value = e instanceof Error ? (e.message || 'Fehler beim Bearbeiten des Sparplans') : 'Fehler beim Bearbeiten des Sparplans'
  } finally {
    savingId.value = null
  }
}

// --- Delete ---
function requestDelete(id: number) {
  editingId.value = null
  confirmDeleteId.value = id
}

function cancelDelete() {
  confirmDeleteId.value = null
}

async function confirmDelete(id: number) {
  error.value = null
  deletingId.value = id

  try {
    await deleteSparplan(id)
    sparplaene.value = sparplaene.value.filter(p => p.id !== id)
    confirmDeleteId.value = null
  } catch (e: unknown) {
    error.value = e instanceof Error ? (e.message || 'Fehler beim Löschen des Sparplans') : 'Fehler beim Löschen des Sparplans'
  } finally {
    deletingId.value = null
  }
}

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('de-DE')
}

onMounted(() => { void loadSparplaene() })
</script>

<template>
  <section class="page">
    <header class="header">
      <div>
        <h2 class="title">Gespeicherte Sparpläne</h2>
        <p class="subtitle">Bearbeiten oder Löschen direkt in der Liste.</p>
      </div>

      <button class="btn btn-secondary" type="button" @click="loadSparplaene" :disabled="loading">
        Aktualisieren
      </button>
    </header>

    <div v-if="loading" class="hint">
      <span class="spinner" aria-hidden="true"></span>
      Lade Sparpläne ...
    </div>

    <div v-else-if="error" class="alert">
      <strong>Fehler:</strong> {{ error }}
    </div>

    <div v-else>
      <p v-if="sparplaene.length === 0" class="hint">
        Noch keine Sparpläne gespeichert.
      </p>

      <ul v-else class="list" role="list">
        <li v-for="p in sparplaene" :key="p.id" class="item" role="listitem">
          <div class="main">
            <div class="title-row">
              <strong class="name">{{ p.etfName }}</strong>
              <span class="chip">#{{ p.id }}</span>
            </div>

            <div class="meta">
              <span><span class="label">Rate:</span> {{ p.monatlicheRate }} €</span>
              <span class="dot">•</span>
              <span><span class="label">Laufzeit:</span> {{ p.laufzeitJahre }} Jahre</span>
              <span class="dot">•</span>
              <span><span class="label">Erstellt:</span> {{ formatDate(p.erstelltAm) }}</span>
            </div>

            <div v-if="editingId === p.id" class="edit-panel">
              <label class="field">
                <span class="field-label">ETF</span>
                <input class="input" v-model="editForm.etfName" type="text" />
              </label>

              <label class="field">
                <span class="field-label">Monatliche Rate (€)</span>
                <input class="input" v-model.number="editForm.monatlicheRate" type="number" min="25" max="10000" step="1" />
              </label>

              <label class="field">
                <span class="field-label">Laufzeit (Jahre)</span>
                <input class="input" v-model.number="editForm.laufzeitJahre" type="number" min="1" max="60" step="1" />
              </label>
            </div>
          </div>

          <div class="actions">
            <template v-if="editingId === p.id">
              <button class="btn btn-secondary btn-small" type="button" @click="cancelEdit" :disabled="savingId === p.id">
                Abbrechen
              </button>

              <button class="btn btn-primary btn-small" type="button" @click="saveEdit(p.id)" :disabled="savingId === p.id">
                <span v-if="savingId === p.id" class="spinner" aria-hidden="true"></span>
                <span v-else>Speichern</span>
              </button>
            </template>

            <template v-else-if="confirmDeleteId === p.id">
              <button class="btn btn-secondary btn-small" type="button" @click="cancelDelete" :disabled="deletingId === p.id">
                Abbrechen
              </button>

              <button class="btn btn-danger btn-small" type="button" @click="confirmDelete(p.id)" :disabled="deletingId === p.id">
                <span v-if="deletingId === p.id" class="spinner" aria-hidden="true"></span>
                <span v-else>Wirklich löschen</span>
              </button>
            </template>

            <template v-else>
              <button class="btn btn-ghost btn-icon" type="button" @click="startEdit(p)" aria-label="Bearbeiten" title="Bearbeiten">
                ✏️
              </button>

              <button class="btn btn-danger-outline btn-icon" type="button" @click="requestDelete(p.id)" aria-label="Löschen" title="Löschen">
                🗑️
              </button>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.page { max-width: 980px; margin: 0 auto; padding: 0.5rem 0.25rem 0; }
.header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1rem; }
.title { margin:0; font-size:1.4rem; color:#e5e7eb; }
.subtitle { margin:0.35rem 0 0; color:#9ca3af; font-size:0.95rem; }
.hint { display:flex; align-items:center; gap:0.6rem; color:#9ca3af; padding:0.75rem 0; }
.alert { border:1px solid rgba(220,38,38,.35); background:rgba(220,38,38,.08); color:#fca5a5; padding:0.75rem; border-radius:10px; }
.list { list-style:none; padding:0; margin:0; display:grid; gap:0.75rem; }
.item { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:0.9rem 1rem; border-radius:14px; border:1px solid rgba(229,231,235,.12); background:rgba(17,24,39,.55); box-shadow:0 10px 30px rgba(0,0,0,.25); }
.main { min-width:0; }
.title-row { display:flex; align-items:center; gap:0.5rem; }
.name { color:#e5e7eb; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:58ch; }
.chip { font-size:.8rem; color:#a7f3d0; background:rgba(16,185,129,.12); border:1px solid rgba(16,185,129,.25); padding:0.15rem 0.45rem; border-radius:999px; }
.meta { margin-top:.35rem; color:#cbd5e1; font-size:.92rem; display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; }
.label { color:#94a3b8; }
.dot { opacity:.6; }
.actions { display:flex; align-items:center; gap:.5rem; flex-shrink:0; }

.edit-panel { margin-top:.75rem; display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:.75rem; }
.field { display:grid; gap:.35rem; }
.field-label { font-size:.8rem; color:#94a3b8; }
.input { padding:.55rem .65rem; border-radius:10px; border:1px solid rgba(229,231,235,.18); background:rgba(17,24,39,.35); color:#e5e7eb; outline:none; }
.input:focus { border-color:rgba(65,184,131,.65); box-shadow:0 0 0 3px rgba(65,184,131,.18); }

.btn { border:1px solid transparent; border-radius:999px; padding:.55rem .9rem; cursor:pointer; font-weight:600; transition:transform .08s ease, background .2s ease, border-color .2s ease, opacity .2s ease; user-select:none; color:#e5e7eb; }
.btn:active { transform:translateY(1px); }
.btn:disabled { opacity:.6; cursor:not-allowed; }
.btn-small { padding:.45rem .75rem; font-size:.92rem; }
.btn-icon { width:42px; height:42px; padding:0; display:grid; place-items:center; border-radius:999px; }

.btn-secondary { background:rgba(229,231,235,.12); border-color:rgba(229,231,235,.15); }
.btn-secondary:hover { background:rgba(229,231,235,.18); }

.btn-primary { background:rgba(65,184,131,.9); color:#06130e; }
.btn-primary:hover { background:rgba(65,184,131,1); }

.btn-ghost { background:transparent; border-color:rgba(229,231,235,.15); }
.btn-ghost:hover { background:rgba(229,231,235,.08); }

.btn-danger { background:rgba(220,38,38,.9); color:#fff; }
.btn-danger:hover { background:rgba(185,28,28,.95); }

.btn-danger-outline { background:transparent; border-color:rgba(220,38,38,.45); color:#fca5a5; }
.btn-danger-outline:hover { background:rgba(220,38,38,.12); border-color:rgba(220,38,38,.65); }

.spinner { width:16px; height:16px; border-radius:999px; border:2px solid rgba(229,231,235,.35); border-top-color:rgba(229,231,235,.95); animation:spin .8s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg); } }

@media (max-width:700px){
  .edit-panel{ grid-template-columns:1fr; }
  .item{ flex-direction:column; }
  .actions{ justify-content:flex-end; width:100%; }
}
</style>
