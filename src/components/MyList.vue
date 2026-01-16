<script setup lang="ts">
/**
 * MY LIST VIEW - PRESENTATION-LOGIC PATTERN
 *
 * ✅ VIEW (Diese Datei):
 *    - Template (HTML - was der User sieht)
 *    - Styles (CSS - wie es aussieht)
 *    - MINIMALES Script (nur Import der Logik)
 *
 * ✅ LOGIK (MyList.logic.ts):
 *    - State Management
 *    - Business Logic
 *    - API Calls
 *    - Berechnungen
 */

import { useMyList } from '@/composables/components/useMyList'

const props = defineProps<{
  reloadKey?: number
}>()

// Alle Logik kommt aus der separaten Logic-Datei
const {
  loading,
  error,
  sparplaene,
  editingId,
  savingId,
  editForm,
  confirmDeleteId,
  deletingId,
  expandedId,
  getScenario,
  formatDate,
  formatCurrency,
  formatPercent,
  getHoldYearsValue,
  updateHoldYears,
  toggleDetails,
  loadSparplaene,
  startEdit,
  cancelEdit,
  saveEdit,
  requestDelete,
  cancelDelete,
  confirmDelete,
} = useMyList(props)

// Alias für Template (kürzerer Name)
const s = getScenario


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
      <p v-if="sparplaene.length === 0" class="hint">Noch keine Sparpläne gespeichert.</p>

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
                <input
                  class="input"
                  type="text"
                  v-model="editForm.etfName"
                  maxlength="60"
                  aria-label="ETF Name"
                />
              </label>

              <label class="field">
                <span class="field-label">Monatliche Rate (€)</span>
                <input
                  class="input"
                  type="number"
                  v-model.number="editForm.monatlicheRate"
                  min="25"
                  max="10000"
                  step="1"
                  required
                  aria-label="Monatliche Rate"
                  @input="editForm.monatlicheRate = Math.max(25, Math.min(10000, Math.abs(editForm.monatlicheRate || 0)))"
                />
              </label>

              <label class="field">
                <span class="field-label">Laufzeit (Jahre)</span>
                <input
                  class="input"
                  type="number"
                  v-model.number="editForm.laufzeitJahre"
                  min="1"
                  max="50"
                  step="1"
                  required
                  aria-label="Laufzeit"
                  @input="editForm.laufzeitJahre = Math.max(1, Math.min(50, Math.abs(editForm.laufzeitJahre || 0)))"
                />
              </label>
            </div>

            <div v-if="expandedId === p.id" class="scenario-box">
              <div class="scenario-head">
                <strong class="scenario-title">Szenarien</strong>
                <span v-if="s(p.id).etf" class="scenario-pill">
                  Risiko: {{ s(p.id).etf?.riskLabel }}
                </span>
              </div>

              <div class="hold-row">
                <label class="hold-label">
                  Haltezeit nach Sparphase (Jahre)
                  <input
                    class="hold-input"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    :value="getHoldYearsValue(p.id)"
                    @input="(e) => {
                      const val = Math.max(0, Math.min(100, Math.abs(Number((e.target as HTMLInputElement).value) || 0)));
                      updateHoldYears(p.id, val);
                    }"
                  />
                </label>
              </div>

              <div class="scenario-grid">
                <div><span class="label">Einzahlung:</span> {{ formatCurrency(s(p.id).paidIn) }}</div>

                <div><span class="label">Worst ({{ formatPercent(s(p.id).worst) }}):</span> {{ formatCurrency(s(p.id).endWorst) }}</div>
                <div><span class="label">Basis ({{ formatPercent(s(p.id).base) }}):</span> {{ formatCurrency(s(p.id).endBase) }}</div>
                <div><span class="label">Best ({{ formatPercent(s(p.id).best) }}):</span> {{ formatCurrency(s(p.id).endBest) }}</div>

                <div v-if="s(p.id).etf" class="muted">
                  <span class="label">Volatilität (1J):</span> {{ s(p.id).etf?.volatility1y.toFixed(1) }}%
                  ·
                  <span class="label">Max. Drawdown (1J):</span> {{ s(p.id).etf?.maxDrawdown1y.toFixed(1) }}%
                </div>

                <div v-if="s(p.id).drawdownHint != null" class="muted">
                  <span class="label">Grobe Drawdown-Idee:</span>
                  Bei einem Rückgang wie im (1J) Drawdown läge der Wert ungefähr bei
                  {{ formatCurrency(s(p.id).drawdownHint!) }}
                </div>
              </div>

              <p class="tiny-muted">
                *Diese Szenarien sind vereinfachte Annahmen (keine Prognose).
              </p>
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
              <button class="btn btn-ghost btn-icon" type="button" @click="toggleDetails(p.id)" aria-label="Szenarien" title="Szenarien">
                📈
              </button>

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
.main { min-width:0; width:100%; }
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

.scenario-box { margin-top:0.75rem; padding:0.75rem; border-radius:12px; border:1px solid rgba(229,231,235,.12); background: rgba(17,24,39,.30); color:#e5e7eb; }
.scenario-head { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem; }
.scenario-pill{ font-size:.8rem; color:#cbd5e1; background: rgba(229,231,235,.08); border:1px solid rgba(229,231,235,.12); padding:0.15rem 0.5rem; border-radius:999px; }

.hold-row{ display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin: 0.35rem 0 0.65rem; }
.hold-label{ display:flex; align-items:center; gap:0.5rem; color:#cbd5e1; font-size:.92rem; }
.hold-input{ width:90px; padding:.45rem .55rem; border-radius:10px; border:1px solid rgba(229,231,235,.18); background:rgba(17,24,39,.35); color:#e5e7eb; outline:none; }
.hold-input:focus { border-color:rgba(65,184,131,.65); box-shadow:0 0 0 3px rgba(65,184,131,.18); }
.hold-hint{ color:#94a3b8; font-size:.85rem; }

.scenario-grid { display:grid; gap:0.35rem; color:#e5e7eb; }
.muted { color:#cbd5e1; }
.tiny-muted { margin-top:0.5rem; font-size:0.8rem; color:#94a3b8; }

@media (max-width:700px){
  .edit-panel{ grid-template-columns:1fr; }
  .item{ flex-direction:column; }
  .actions{ justify-content:flex-end; width:100%; }
}
</style>

