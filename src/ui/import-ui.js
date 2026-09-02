import { fetchRepoFromGitHub, compileProject } from '../data/github.js'

let onImportCallback = null
let currentPreview = null
let repoList = []
let selectedRepos = new Set()

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

  if (!btn || !modal || !form) return

  // Tab switching
  const tabs = modal.querySelectorAll('.import-tab')
  const tabContents = {
    url: document.getElementById('import-tab-url'),
    list: document.getElementById('import-tab-list'),
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      Object.entries(tabContents).forEach(([key, el]) => {
        if (el) el.style.display = key === tab.dataset.tab ? 'block' : 'none'
      })
    })
  })

  btn.addEventListener('click', () => {
    if (urlInput) urlInput.value = ''
    if (previewEl) previewEl.classList.remove('visible')
    if (statusEl) { statusEl.textContent = ''; statusEl.className = '' }
    if (confirmBtn) confirmBtn.style.display = 'none'
    currentPreview = null
    modal.classList.add('active')
  })

  const closeModal = () => {
    modal.classList.remove('active')
    selectedRepos.clear()
  }
  close?.addEventListener('click', closeModal)
  backdrop?.addEventListener('click', closeModal)

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

    const allProjects = JSON.parse(localStorage.getItem('portfolio-projects-v2') || '[]')
    const compiled = compileProject({
      title: editTitle.textContent.trim(),
      role: editRole.textContent.trim(),
      tag: editTag.textContent.trim(),
      desc: editDesc.textContent.trim(),
      tech,
      links: currentPreview.links,
    }, allProjects.length)

    if (onImportCallback) onImportCallback(compiled)
    closeModal()
  })

  // ── Repo List Setup ──
  const loadBtn = document.getElementById('repo-load-btn')
  const repoStatus = document.getElementById('repo-list-status')
  const repoContainer = document.getElementById('repo-list-container')
  const repoListEl = document.getElementById('repo-list')
  const repoCount = document.getElementById('repo-count')
  const selectAll = document.getElementById('repo-select-all')
  const importSelectedBtn = document.getElementById('repo-import-btn')
  const selectedCount = document.getElementById('repo-selected-count')

  if (!loadBtn || !repoListEl) return

  const GITHUB_USER = 'brunocsilva41'

  loadBtn.addEventListener('click', async () => {
    loadBtn.disabled = true
    loadBtn.textContent = 'Carregando...'
    repoStatus.textContent = 'Buscando repositórios...'

    try {
      const repos = await fetchAllRepos()
      repoList = repos
      selectedRepos.clear()
      renderRepoList()
      repoContainer.style.display = 'block'
      repoStatus.textContent = `${repos.length} repositórios encontrados`
    } catch (err) {
      repoStatus.textContent = `Erro: ${err.message}`
      repoStatus.style.color = '#f97373'
    } finally {
      loadBtn.disabled = false
      loadBtn.textContent = 'Recarregar Repositórios'
    }
  })

  selectAll?.addEventListener('change', () => {
    if (selectAll.checked) {
      repoList.forEach(r => selectedRepos.add(r.id))
    } else {
      selectedRepos.clear()
    }
    updateRepoSelection()
  })

  importSelectedBtn?.addEventListener('click', async () => {
    const selected = repoList.filter(r => selectedRepos.has(r.id))
    if (selected.length === 0) return

    importSelectedBtn.disabled = true
    importSelectedBtn.textContent = `Importando ${selected.length} repositórios...`

    let successCount = 0
    let failCount = 0
    const compiledProjects = []

    for (const repo of selected) {
      try {
        const data = await buildProjectFromRepo(repo)
        const allProjects = JSON.parse(localStorage.getItem('portfolio-projects-v2') || '[]')
        const compiled = compileProject(data, allProjects.length + compiledProjects.length)
        compiledProjects.push(compiled)
        successCount++
      } catch {
        failCount++
      }
    }

    if (onImportCallback && compiledProjects.length > 0) {
      onImportCallback(compiledProjects)
    }

    importSelectedBtn.disabled = false
    importSelectedBtn.textContent = 'Importar Selecionados'

    if (failCount === 0) {
      repoStatus.textContent = `${successCount} projetos importados com sucesso!`
      repoStatus.style.color = '#50e3c2'
    } else {
      repoStatus.textContent = `${successCount} importados, ${failCount} falhas`
      repoStatus.style.color = '#f97373'
    }

    selectedRepos.clear()
    renderRepoList()
    setTimeout(closeModal, 1500)
  })

  async function fetchAllRepos() {
    const perPage = 100
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=${perPage}&sort=updated&type=all`

    const res = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })

    if (!res.ok) {
      if (res.status === 403) throw new Error('Limite de requisições. Tente novamente mais tarde ou use um token.')
      if (res.status === 404) throw new Error('Usuário não encontrado.')
      throw new Error(`Erro GitHub (${res.status})`)
    }

    const repos = await res.json()

    const linkHeader = res.headers.get('Link')
    if (linkHeader && linkHeader.includes('rel="last"')) {
      const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
      if (lastMatch) {
        const lastPage = parseInt(lastMatch[1])
        const remaining = []
        for (let page = 2; page <= lastPage; page++) {
          const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=${perPage}&page=${page}&sort=updated&type=all`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
          })
          if (r.ok) {
            const data = await r.json()
            remaining.push(...data)
          }
        }
        repos.push(...remaining)
      }
    }

    return repos
  }

  async function buildProjectFromRepo(repo) {
    let desc = repo.description || 'Sem descrição disponível.'

    let readmeContent = ''
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/readme`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      })
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json()
        try { readmeContent = atob(readmeData.content.replace(/\n/g, '')) } catch {}
      }
    } catch {}

    if (readmeContent) {
      const extracted = extractDescriptionFromReadme(readmeContent)
      if (extracted) desc = extracted
    }

    const tech = new Set()
    if (repo.language) tech.add(repo.language)
    if (repo.topics) repo.topics.forEach(t => tech.add(t.charAt(0).toUpperCase() + t.slice(1)))

    const title = repo.name
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())

    return {
      title,
      role: 'Desenvolvedor',
      tag: repo.language || 'Projeto',
      desc,
      tech: [...tech].slice(0, 10),
      links: { github: repo.html_url, demo: repo.homepage || '' },
    }
  }

  function extractDescriptionFromReadme(readme) {
    const lines = readme.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('![') && !trimmed.startsWith('<')) {
        const cleaned = trimmed.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim()
        if (cleaned.length > 20 && cleaned.length < 300) return cleaned
      }
    }
    return ''
  }

  function renderRepoList() {
    repoListEl.innerHTML = ''
    repoCount.textContent = `${repoList.length} repositórios`

    repoList.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))

    repoList.forEach(repo => {
      const item = document.createElement('div')
      item.className = 'repo-item'
      if (selectedRepos.has(repo.id)) item.classList.add('selected')

      const desc = repo.description || 'Sem descrição'
      const shortDesc = desc.length > 80 ? desc.slice(0, 80) + '...' : desc

      item.innerHTML = `
        <input type="checkbox" ${selectedRepos.has(repo.id) ? 'checked' : ''} />
        <div class="repo-item-info">
          <div class="repo-item-name">${escapeHtml(repo.name)}</div>
          <div class="repo-item-desc">${escapeHtml(shortDesc)}</div>
          <div class="repo-item-meta">
            ${repo.language ? `<span class="repo-item-lang">${escapeHtml(repo.language)}</span>` : ''}
            <span class="repo-item-star">★ ${repo.stargazers_count || 0}</span>
          </div>
        </div>
      `

      const checkbox = item.querySelector('input')
      item.addEventListener('click', (e) => {
        if (e.target === checkbox) return
        checkbox.checked = !checkbox.checked
        checkbox.dispatchEvent(new Event('change'))
      })
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedRepos.add(repo.id)
          item.classList.add('selected')
        } else {
          selectedRepos.delete(repo.id)
          item.classList.remove('selected')
        }
        updateRepoSelection()
      })

      repoListEl.appendChild(item)
    })

    updateRepoSelection()
  }

  function updateRepoSelection() {
    const count = selectedRepos.size
    selectedCount.textContent = count
    importSelectedBtn.disabled = count === 0
    if (selectAll) {
      selectAll.checked = repoList.length > 0 && count === repoList.length
      selectAll.indeterminate = count > 0 && count < repoList.length
    }
  }

  function escapeHtml(str) {
    const d = document.createElement('div')
    d.textContent = str
    return d.innerHTML
  }
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
