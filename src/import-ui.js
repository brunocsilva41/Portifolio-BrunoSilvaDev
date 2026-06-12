import { fetchRepoFromGitHub, compileProject } from './projects.js'

let onImportCallback = null
let currentPreview = null

export function setupImportUI(callback) {
  onImportCallback = callback

  const btn = document.getElementById('import-btn')
  const modal = document.getElementById('import-modal')
  const close = document.getElementById('import-close')
  const backdrop = document.getElementById('import-backdrop')
  const form = document.getElementById('import-form')
  const urlInput = document.getElementById('import-url')
  const statusEl = document.getElementById('import-status')
  const previewEl = document.getElementById('import-preview')
  const confirmBtn = document.getElementById('import-confirm')

  btn.addEventListener('click', () => {
    urlInput.value = ''
    previewEl.classList.remove('visible')
    statusEl.textContent = ''
    statusEl.className = ''
    confirmBtn.style.display = 'none'
    currentPreview = null
    modal.classList.add('active')
  })

  const closeModal = () => modal.classList.remove('active')
  close.addEventListener('click', closeModal)
  backdrop.addEventListener('click', closeModal)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const url = urlInput.value.trim()
    if (!url) return

    statusEl.textContent = 'Buscando repositório...'
    statusEl.className = 'import-status loading'
    previewEl.classList.remove('visible')
    confirmBtn.style.display = 'none'
    currentPreview = null

    try {
      const data = await fetchRepoFromGitHub(url)
      currentPreview = data
      showPreview(previewEl, data, url)
      statusEl.textContent = 'Pronto! Revise os dados antes de importar.'
      statusEl.className = 'import-status success'
      confirmBtn.style.display = 'flex'
    } catch (err) {
      statusEl.textContent = err.message
      statusEl.className = 'import-status error'
    }
  })

  confirmBtn.addEventListener('click', () => {
    if (!currentPreview) return

    const editTitle = document.getElementById('preview-title')
    const editRole = document.getElementById('preview-role')
    const editTag = document.getElementById('preview-tag')
    const editDesc = document.getElementById('preview-desc')
    const techTags = previewEl.querySelectorAll('.preview-tech-tag')
    const tech = Array.from(techTags).map(t => t.textContent.trim()).filter(Boolean)

    const compiled = compileProject({
      title: editTitle.textContent.trim(),
      role: editRole.textContent.trim(),
      tag: editTag.textContent.trim(),
      desc: editDesc.textContent.trim(),
      tech,
      links: currentPreview.links,
    }, 0)

    if (onImportCallback) onImportCallback(compiled)
    closeModal()
  })
}

function showPreview(container, data, url) {
  const editTitle = document.getElementById('preview-title')
  const editRole = document.getElementById('preview-role')
  const editTag = document.getElementById('preview-tag')
  const editDesc = document.getElementById('preview-desc')
  const techContainer = document.getElementById('preview-techs')
  const linkEl = document.getElementById('preview-link')

  editTitle.textContent = data.title
  editRole.textContent = 'Desenvolvedor'
  editTag.textContent = data.tag
  editDesc.textContent = data.desc
  linkEl.href = data.links.github
  linkEl.textContent = data.links.github

  techContainer.innerHTML = ''
  data.tech.forEach(t => {
    const span = document.createElement('span')
    span.className = 'preview-tech-tag'
    span.contentEditable = 'true'
    span.textContent = t
    techContainer.appendChild(span)
  })

  makeEditable(editTitle)
  makeEditable(editRole)
  makeEditable(editTag)
  makeEditable(editDesc)

  container.classList.add('visible')
}

function makeEditable(el) {
  el.contentEditable = 'true'
  el.classList.add('editable')
  el.addEventListener('blur', () => {
    if (!el.textContent.trim()) el.textContent = el.dataset.fallback || '...'
  })
  el.dataset.fallback = el.textContent
}
