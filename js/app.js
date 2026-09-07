/**
 * Freelance Flow - Task Tracker & Workspace Controller
 * 
 * Multi-user freelance management system with:
 * 1. Task Tracker with Universal Core + Flexible Custom Columns & Presets
 * 2. Calendar & Deadline Engine with Project Deadline Sync & Custom Events
 * 3. Smart Deadline Reminder Alert with customizable threshold & daily dismissal
 * 4. Revenue & Cash Flow Analytics with customizable currency symbol
 * 5. Multi-user Authentication & Workspace Preferences
 */

(function () {
  'use strict';

  // ==========================================
  // Presets & Default Column Definitions
  // ==========================================
  const DEFAULT_PRESETS = {
    video_editor: {
      name: 'Video Editor',
      icon: 'fa-video',
      columns: [
        { id: 'rawFilesUrl', label: 'Raw Footage', type: 'url', icon: 'fa-folder-open', visible: true },
        { id: 'youtubeLink', label: 'Final Video', type: 'url', icon: 'fa-arrow-up-right-from-square', visible: true }
      ]
    },
    designer: {
      name: 'Designer',
      icon: 'fa-palette',
      columns: [
        { id: 'figmaLink', label: 'Figma Board', type: 'url', icon: 'fa-brands fa-figma', visible: true },
        { id: 'assetDrive', label: 'Asset Drive', type: 'url', icon: 'fa-folder-open', visible: true },
        { id: 'revisions', label: 'Revisions', type: 'text', icon: 'fa-rotate-left', visible: true }
      ]
    },
    photographer: {
      name: 'Photographer',
      icon: 'fa-camera',
      columns: [
        { id: 'shootLocation', label: 'Location', type: 'text', icon: 'fa-location-dot', visible: true },
        { id: 'rawGallery', label: 'Raw Gallery', type: 'url', icon: 'fa-images', visible: true },
        { id: 'deliveredGallery', label: 'Delivered Gallery', type: 'url', icon: 'fa-circle-check', visible: true }
      ]
    },
    developer: {
      name: 'Web Developer',
      icon: 'fa-code',
      columns: [
        { id: 'repoUrl', label: 'GitHub / Repo', type: 'url', icon: 'fa-brands fa-github', visible: true },
        { id: 'liveUrl', label: 'Live Demo', type: 'url', icon: 'fa-globe', visible: true },
        { id: 'techStack', label: 'Tech Stack', type: 'text', icon: 'fa-layer-group', visible: true }
      ]
    },
    writer: {
      name: 'Writer / Copywriter',
      icon: 'fa-pen-nib',
      columns: [
        { id: 'docUrl', label: 'Draft Link', type: 'url', icon: 'fa-file-lines', visible: true },
        { id: 'wordCount', label: 'Word Count', type: 'number', icon: 'fa-hashtag', visible: true }
      ]
    },
    general: {
      name: 'General',
      icon: 'fa-list-check',
      columns: [
        { id: 'deliverableUrl', label: 'Deliverable Link', type: 'url', icon: 'fa-link', visible: true }
      ]
    }
  };

  // User Settings State
  let userSettings = {
    currency: '$',
    deadlineAlertDays: 1,
    dismissedAlertDate: '',
    activeBoardId: '',
    boards: []
  };

  let sidebarAccordionExpanded = true;

  function getActiveBoard() {
    if (userSettings.activeBoardId === 'all') {
      return {
        id: 'all',
        name: 'All Jobs',
        icon: 'fa-layer-group',
        columns: []
      };
    }
    const boards = userSettings.boards || [];
    const found = boards.find(b => b.id === userSettings.activeBoardId);
    if (found) return found;
    if (boards.length > 0) {
      userSettings.activeBoardId = boards[0].id;
      return boards[0];
    }
    return null;
  }

  async function setActiveBoard(boardId) {
    userSettings.activeBoardId = boardId;
    await saveUserSettings(userSettings);
    switchTab('panel-projects');
    renderAll();
  }
  window.flowSetActiveBoard = setActiveBoard;

  // In-memory data caches synced with MySQL
  let cachedProjects = [];
  let cachedCalendarEvents = [];

  // Calendar view navigation state
  const now = new Date();
  let calendarYear = now.getFullYear();
  let calendarMonth = now.getMonth(); // 0 - 11

  // Global search state
  let projectSearchQuery = '';

  // Column-level filters & sorting states
  let columnFilters = {}; // { [colKey]: 'filter_value' }
  let activeTableSort = {
    column: '',       // 'index', 'title', 'board', 'status', 'payment', 'price', 'dueDate', or custom column id
    direction: 'asc'  // 'asc' | 'desc'
  };

  function applyColumnAction(colKey, val) {
    if (!val || val === 'default' || val === 'all') {
      delete columnFilters[colKey];
      if (activeTableSort.column === colKey) {
        activeTableSort.column = '';
        activeTableSort.direction = 'asc';
      }
    } else if (val.startsWith('sort_')) {
      activeTableSort.column = colKey;
      activeTableSort.direction = (val === 'sort_desc') ? 'desc' : 'asc';
    } else if (val.startsWith('filter_')) {
      const fVal = val.replace('filter_', '');
      columnFilters[colKey] = fVal;
    } else {
      columnFilters[colKey] = val;
    }
    renderSheetTable();
  }
  window.flowApplyColumnAction = applyColumnAction;

  function resetAllFiltersAndSorts() {
    columnFilters = {};
    activeTableSort = { column: '', direction: 'asc' };
    renderSheetTable();
  }
  window.flowResetAllFiltersAndSorts = resetAllFiltersAndSorts;

  // Backward compatibility alias
  window.flowToggleSort = function(colKey) {
    if (activeTableSort.column === colKey) {
      if (activeTableSort.direction === 'asc') {
        activeTableSort.direction = 'desc';
      } else {
        activeTableSort.column = '';
        activeTableSort.direction = 'asc';
      }
    } else {
      activeTableSort.column = colKey;
      activeTableSort.direction = 'asc';
    }
    renderSheetTable();
  };
  window.flowResetSort = resetAllFiltersAndSorts;

  // Render individual column header with customized dropdown sorter and filter
  function renderColumnHeader(colKey, label, align = 'left', extraClass = '', customColDef = null, sampleProjects = []) {
    const isSorted = activeTableSort.column === colKey;
    const sortDir = isSorted ? activeTableSort.direction : null;
    const activeFilter = columnFilters[colKey] || null;
    const isColActive = isSorted || Boolean(activeFilter);

    let optionsHtml = '';

    if (colKey === 'title') {
      optionsHtml = `
        <option value="default" ${!isSorted ? 'selected' : ''}>All</option>
        <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>A ➔ Z ▲</option>
        <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Z ➔ A ▼</option>
      `;
    } else if (colKey === 'board') {
      const boards = userSettings.boards || [];
      const boardOptions = boards.map(b => {
        const isSel = activeFilter === b.id;
        return `<option value="filter_${escapeHtml(b.id)}" ${isSel ? 'selected' : ''}>${escapeHtml(b.name)}</option>`;
      }).join('');

      optionsHtml = `
        <option value="default" ${!isColActive ? 'selected' : ''}>All Jobs</option>
        ${boardOptions}
        <option disabled>──────────</option>
        <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>A-Z ▲</option>
        <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Z-A ▼</option>
      `;
    } else if (colKey === 'status') {
      optionsHtml = `
        <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
        <option value="filter_Published" ${activeFilter === 'Published' || activeFilter === 'Completed' ? 'selected' : ''}>Delivered</option>
        <option value="filter_In Progress" ${activeFilter === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option value="filter_Not Started" ${activeFilter === 'Not Started' ? 'selected' : ''}>Not Started</option>
        <option disabled>──────────</option>
        <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>Start ➔ Done ▲</option>
        <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Done ➔ Start ▼</option>
      `;
    } else if (colKey === 'payment') {
      optionsHtml = `
        <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
        <option value="filter_Unpaid" ${activeFilter === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
        <option value="filter_Paid" ${activeFilter === 'Paid' ? 'selected' : ''}>Paid</option>
        <option disabled>──────────</option>
        <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>Unpaid 1st ▲</option>
        <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Paid 1st ▼</option>
      `;
    } else if (colKey === 'price') {
      optionsHtml = `
        <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
        <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>$$$ ➔ $ ▼</option>
        <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>$ ➔ $$$ ▲</option>
        <option disabled>──────────</option>
        <option value="filter_priced" ${activeFilter === 'priced' ? 'selected' : ''}>&gt; $0</option>
        <option value="filter_free" ${activeFilter === 'free' ? 'selected' : ''}>$0</option>
      `;
    } else if (colKey === 'dueDate') {
      optionsHtml = `
        <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
        <option value="filter_overdue" ${activeFilter === 'overdue' ? 'selected' : ''}>Overdue</option>
        <option value="filter_today" ${activeFilter === 'today' ? 'selected' : ''}>Today</option>
        <option value="filter_tomorrow" ${activeFilter === 'tomorrow' ? 'selected' : ''}>Tomorrow</option>
        <option value="filter_upcoming" ${activeFilter === 'upcoming' ? 'selected' : ''}>Next 7 Days</option>
        <option value="filter_undated" ${activeFilter === 'undated' ? 'selected' : ''}>No Date</option>
        <option disabled>──────────</option>
        <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>Earliest ▲</option>
        <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Latest ▼</option>
      `;
    } else if (customColDef) {
      const colType = customColDef.type || 'text';

      if (colType === 'number') {
        optionsHtml = `
          <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
          <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>High ➔ Low ▼</option>
          <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>Low ➔ High ▲</option>
          <option disabled>──────────</option>
          <option value="filter_positive" ${activeFilter === 'positive' ? 'selected' : ''}>&gt; 0</option>
          <option value="filter_empty" ${activeFilter === 'empty' ? 'selected' : ''}>Zero / Blank</option>
        `;
      } else if (colType === 'date') {
        optionsHtml = `
          <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
          <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>Earliest ▲</option>
          <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Latest ▼</option>
          <option disabled>──────────</option>
          <option value="filter_has_date" ${activeFilter === 'has_date' ? 'selected' : ''}>Has Date</option>
          <option value="filter_empty" ${activeFilter === 'empty' ? 'selected' : ''}>No Date</option>
        `;
      } else if (colType === 'url') {
        optionsHtml = `
          <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
          <option value="filter_has_link" ${activeFilter === 'has_link' ? 'selected' : ''}>Has Link</option>
          <option value="filter_no_link" ${activeFilter === 'no_link' ? 'selected' : ''}>No Link</option>
        `;
      } else {
        const distinctVals = new Set();
        (sampleProjects || []).forEach(p => {
          const cf = p.customFields || {};
          let val = cf[colKey] !== undefined ? cf[colKey] : p[colKey];
          if (val && typeof val === 'string' && val.trim().length > 0) {
            distinctVals.add(val.trim());
          }
        });

        let distinctOptionsHtml = '';
        if (distinctVals.size > 0 && distinctVals.size <= 8) {
          distinctOptionsHtml = `<option disabled>── Filter Values ──</option>` +
            Array.from(distinctVals).map(v => {
              const isSel = activeFilter === `val_${v}`;
              return `<option value="filter_val_${escapeHtml(v)}" ${isSel ? 'selected' : ''}>${escapeHtml(v)}</option>`;
            }).join('');
        }

        optionsHtml = `
          <option value="default" ${!isColActive ? 'selected' : ''}>All</option>
          <option value="sort_asc" ${isSorted && sortDir === 'asc' ? 'selected' : ''}>A ➔ Z ▲</option>
          <option value="sort_desc" ${isSorted && sortDir === 'desc' ? 'selected' : ''}>Z ➔ A ▼</option>
          <option disabled>──────────</option>
          <option value="filter_filled" ${activeFilter === 'filled' ? 'selected' : ''}>Filled</option>
          <option value="filter_empty" ${activeFilter === 'empty' ? 'selected' : ''}>Empty</option>
          ${distinctOptionsHtml}
        `;
      }
    }

    let triggerIcon = 'fa-chevron-down';
    let activeSummary = '';
    if (isSorted) {
      triggerIcon = sortDir === 'asc' ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-wide-short';
      activeSummary = `Sorted ${sortDir === 'asc' ? 'Ascending' : 'Descending'}`;
    } else if (activeFilter) {
      triggerIcon = 'fa-filter';
      activeSummary = `Filtered: ${activeFilter.replace('val_', '')}`;
    }

    const justifyClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

    return `
      <th class="text-${align} ${extraClass} select-none py-2.5 px-3">
        <div class="inline-flex items-center gap-1.5 ${justifyClass}">
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider ${isColActive ? 'text-cyan-400 font-black' : 'text-slate-400'} whitespace-nowrap">
            ${escapeHtml(label)}
          </span>
          <div class="relative inline-flex items-center" title="Filter & sort ${escapeHtml(label)}${activeSummary ? ' (' + activeSummary + ')' : ''}">
            <div class="w-5 h-5 rounded flex items-center justify-center border transition-all ${
              isColActive 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/80 shadow-sm shadow-cyan-500/30' 
                : 'bg-slate-900/90 text-slate-500 border-slate-700/80 hover:text-slate-300 hover:border-slate-600'
            }">
              <i class="fa-solid ${triggerIcon} text-[9px] pointer-events-none"></i>
            </div>
            <select 
              onchange="window.flowApplyColumnAction('${colKey}', this.value)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
              title="Filter & sort ${escapeHtml(label)}${activeSummary ? ' (' + activeSummary + ')' : ''}"
            >
              ${optionsHtml}
            </select>
          </div>
        </div>
      </th>
    `;
  }

  // DOM element caches
  const $loginGate = document.getElementById('login-gate');
  const $adminApp = document.getElementById('admin-app');
  const $tabBtnSignin = document.getElementById('tab-btn-signin');
  const $tabBtnRegister = document.getElementById('tab-btn-register');
  const $loginForm = document.getElementById('login-form');
  const $loginUser = document.getElementById('login-username');
  const $loginPass = document.getElementById('login-password');
  const $loginFeedback = document.getElementById('login-feedback');
  const $loginBtn = document.getElementById('login-btn');
  const $loginBtnText = document.getElementById('login-btn-text');
  const $loginBtnSpinner = document.getElementById('login-btn-spinner');
  const $togglePasswordBtn = document.getElementById('toggle-password-btn');

  const $registerForm = document.getElementById('register-form');
  const $regUser = document.getElementById('reg-username');
  const $regPass = document.getElementById('reg-password');
  const $regConfirm = document.getElementById('reg-confirm-password');
  const $regBtn = document.getElementById('register-btn');
  const $regBtnText = document.getElementById('reg-btn-text');
  const $regBtnSpinner = document.getElementById('reg-btn-spinner');
  const $toggleRegPasswordBtn = document.getElementById('toggle-reg-password-btn');

  // ==========================================
  // Helper Functions
  // ==========================================

  function isPaidStatus(status) {
    return status === 'Paid' || status === 'Completely Paid';
  }

  const USD_TO_PHP_RATE = 56.00; // 1 USD = 56 PHP

  function convertCurrencyAmount(amount, fromCur, toCur) {
    const val = parseFloat(amount) || 0;
    if (fromCur === toCur) return val;
    if (fromCur === '$' && toCur === '₱') {
      return Math.round(val * USD_TO_PHP_RATE * 100) / 100;
    }
    if (fromCur === '₱' && toCur === '$') {
      return Math.round((val / USD_TO_PHP_RATE) * 100) / 100;
    }
    return val;
  }

  function getEquivalentMoney(amount) {
    const symbol = userSettings.currency || '$';
    const val = parseFloat(amount) || 0;
    if (symbol === '₱') {
      const usdVal = val / USD_TO_PHP_RATE;
      return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      const phpVal = val * USD_TO_PHP_RATE;
      return `₱${phpVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  function formatMoney(amount) {
    const symbol = userSettings.currency || '$';
    const val = parseFloat(amount) || 0;
    return `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function updateCurrencyDisplays() {
    const symbol = userSettings.currency || '$';
    document.querySelectorAll('.currency-label').forEach(el => {
      el.textContent = symbol;
    });
  }

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, m => HTML_ESCAPES[m]);
  }

  function debounce(fn, wait = 100) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function formatDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // ==========================================
  // API Synchronization Layer
  // ==========================================

  async function syncAllData() {
    try {
      const [projRes, calRes, settingsRes] = await Promise.all([
        fetch('api/projects.php', { credentials: 'same-origin' }),
        fetch('api/calendar.php', { credentials: 'same-origin' }),
        fetch('api/auth.php?action=get_settings', { credentials: 'same-origin' })
      ]);

      if (projRes.status === 401) {
        showLogin();
        return;
      }

      const [projJson, calJson, settingsJson] = await Promise.all([
        projRes.json().catch(() => ({})),
        calRes.json().catch(() => ({})),
        settingsRes.json().catch(() => ({}))
      ]);

      if (projJson.success && Array.isArray(projJson.data)) {
        cachedProjects = projJson.data;
      }
      if (calJson.success && Array.isArray(calJson.data)) {
        cachedCalendarEvents = calJson.data;
      }
      if (settingsJson.success && settingsJson.settings && typeof settingsJson.settings === 'object') {
        const s = settingsJson.settings;
        if (s.currency) userSettings.currency = s.currency;
        if (s.deadlineAlertDays !== undefined) userSettings.deadlineAlertDays = parseInt(s.deadlineAlertDays, 10);
        if (s.dismissedAlertDate) userSettings.dismissedAlertDate = s.dismissedAlertDate;
        
        if (Array.isArray(s.boards) && s.boards.length > 0) {
          userSettings.boards = s.boards.map(b => {
            if (b.presetKey === 'general' || b.id === 'general') {
              return {
                ...b,
                name: 'General',
                columns: (b.columns || []).filter(c => c.id !== 'notes')
              };
            }
            return b;
          });
          userSettings.activeBoardId = s.activeBoardId || (userSettings.boards[0] ? userSettings.boards[0].id : '');
        } else if (s.activePreset) {
          // Backward-compat migration ONLY if legacy activePreset exists
          const legacyPreset = s.activePreset;
          const legacyColumns = Array.isArray(s.customColumns) && s.customColumns.length > 0
            ? s.customColumns
            : (DEFAULT_PRESETS[legacyPreset] ? DEFAULT_PRESETS[legacyPreset].columns : []);
          
          userSettings.boards = [{
            id: legacyPreset,
            name: (DEFAULT_PRESETS[legacyPreset] && DEFAULT_PRESETS[legacyPreset].name) || 'Custom Board',
            icon: (DEFAULT_PRESETS[legacyPreset] && DEFAULT_PRESETS[legacyPreset].icon) || 'fa-briefcase',
            presetKey: legacyPreset,
            columns: JSON.parse(JSON.stringify(legacyColumns))
          }];
          userSettings.activeBoardId = legacyPreset;
        } else {
          // Newly made account: start with zero boards so user has full freedom
          userSettings.boards = [];
          userSettings.activeBoardId = '';
        }
      }

      window.userSettings = userSettings;
      window.cachedProjects = cachedProjects;
      renderAll();
      window.dispatchEvent(new CustomEvent('flowDataLoaded'));
    } catch (err) {
      console.error('Failed to sync data with server:', err);
    }
  }

  async function saveUserSettings(newSettings) {
    try {
      userSettings = { ...userSettings, ...newSettings };
      await fetch('api/auth.php?action=update_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSettings),
        credentials: 'same-origin'
      });
    } catch (err) {
      console.error('Failed to persist user settings:', err);
    }
  }

  // --- Projects CRUD ---
  async function createProjectApi(data) {
    try {
      const res = await fetch('api/projects.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        cachedProjects.unshift(json.data);
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }

  async function updateProjectApi(id, data) {
    try {
      const res = await fetch('api/projects.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedProjects.findIndex(p => p.id === id);
        if (idx !== -1) cachedProjects[idx] = json.data;
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }

  async function patchProjectApi(id, patchData) {
    try {
      const res = await fetch('api/projects.php', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patchData }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedProjects.findIndex(p => p.id === id);
        if (idx !== -1) cachedProjects[idx] = json.data;
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to patch task:', err);
    }
  }

  async function deleteProjectApi(id) {
    try {
      const res = await fetch(`api/projects.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success) {
        cachedProjects = cachedProjects.filter(p => p.id !== id);
        renderAll();
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }

  // --- Calendar Events CRUD ---
  async function createCalendarEventApi(data) {
    try {
      const res = await fetch('api/calendar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        cachedCalendarEvents.push(json.data);
        renderCalendar();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to create calendar event:', err);
    }
  }

  async function updateCalendarEventApi(id, data) {
    try {
      const res = await fetch('api/calendar.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedCalendarEvents.findIndex(e => e.id === id);
        if (idx !== -1) cachedCalendarEvents[idx] = json.data;
        renderCalendar();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to update calendar event:', err);
    }
  }

  async function deleteCalendarEventApi(id) {
    try {
      const res = await fetch(`api/calendar.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success) {
        cachedCalendarEvents = cachedCalendarEvents.filter(e => e.id !== id);
        renderCalendar();
      }
    } catch (err) {
      console.error('Failed to delete calendar event:', err);
    }
  }

  // ==========================================
  // Custom Lil Popup Dialog Modal (Alert / Confirm)
  // ==========================================
  let currentDialogResolver = null;

  window.flowAlert = function ({
    title = 'Notice',
    message = '',
    icon = 'fa-triangle-exclamation',
    type = 'warning',
    confirmText = 'OK'
  } = {}) {
    return new Promise(resolve => {
      const $modal = document.getElementById('flow-dialog-modal');
      const $card = document.getElementById('flow-dialog-card');
      const $iconContainer = document.getElementById('flow-dialog-icon-container');
      const $icon = document.getElementById('flow-dialog-icon');
      const $title = document.getElementById('flow-dialog-title');
      const $msg = document.getElementById('flow-dialog-message');
      const $btnCancel = document.getElementById('flow-dialog-cancel-btn');
      const $btnConfirm = document.getElementById('flow-dialog-confirm-btn');

      if (!$modal) {
        alert(message);
        resolve(true);
        return;
      }

      currentDialogResolver = resolve;
      if ($title) $title.textContent = title;
      if ($msg) $msg.innerHTML = message;
      if ($icon) $icon.className = `fa-solid ${icon}`;

      if (type === 'danger') {
        if ($card) $card.className = 'w-full max-w-sm flow-card rounded-2xl p-5 border border-rose-500/50 shadow-2xl bg-[#0b0f19] relative';
        if ($iconContainer) $iconContainer.className = 'w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0 text-base shadow-sm';
        if ($btnConfirm) $btnConfirm.className = 'px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-md';
      } else if (type === 'info') {
        if ($card) $card.className = 'w-full max-w-sm flow-card rounded-2xl p-5 border border-cyan-500/50 shadow-2xl bg-[#0b0f19] relative';
        if ($iconContainer) $iconContainer.className = 'w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 text-base shadow-sm';
        if ($btnConfirm) $btnConfirm.className = 'btn-flow-primary px-4 py-1.5 rounded-xl text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-md';
      } else {
        // Warning (amber)
        if ($card) $card.className = 'w-full max-w-sm flow-card rounded-2xl p-5 border border-amber-500/40 shadow-2xl bg-[#0b0f19] relative';
        if ($iconContainer) $iconContainer.className = 'w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 text-base shadow-sm';
        if ($btnConfirm) $btnConfirm.className = 'px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold transition-colors cursor-pointer shadow-md';
      }

      if ($btnConfirm) $btnConfirm.textContent = confirmText;
      if ($btnCancel) $btnCancel.classList.add('hidden');
      $modal.classList.remove('hidden');
    });
  };

  window.flowConfirm = function ({
    title = 'Are you sure?',
    message = '',
    icon = 'fa-trash-can',
    type = 'danger',
    confirmText = 'Delete',
    cancelText = 'Cancel'
  } = {}) {
    return new Promise(resolve => {
      const $modal = document.getElementById('flow-dialog-modal');
      const $card = document.getElementById('flow-dialog-card');
      const $iconContainer = document.getElementById('flow-dialog-icon-container');
      const $icon = document.getElementById('flow-dialog-icon');
      const $title = document.getElementById('flow-dialog-title');
      const $msg = document.getElementById('flow-dialog-message');
      const $btnCancel = document.getElementById('flow-dialog-cancel-btn');
      const $btnConfirm = document.getElementById('flow-dialog-confirm-btn');

      if (!$modal) {
        resolve(confirm(message));
        return;
      }

      currentDialogResolver = resolve;
      if ($title) $title.textContent = title;
      if ($msg) $msg.innerHTML = message;
      if ($icon) $icon.className = `fa-solid ${icon}`;

      if (type === 'danger') {
        if ($card) $card.className = 'w-full max-w-sm flow-card rounded-2xl p-5 border border-rose-500/50 shadow-2xl bg-[#0b0f19] relative';
        if ($iconContainer) $iconContainer.className = 'w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0 text-base shadow-sm';
        if ($btnConfirm) $btnConfirm.className = 'px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-md';
      } else {
        if ($card) $card.className = 'w-full max-w-sm flow-card rounded-2xl p-5 border border-cyan-500/50 shadow-2xl bg-[#0b0f19] relative';
        if ($iconContainer) $iconContainer.className = 'w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 text-base shadow-sm';
        if ($btnConfirm) $btnConfirm.className = 'btn-flow-primary px-4 py-1.5 rounded-xl text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-md';
      }

      if ($btnConfirm) $btnConfirm.textContent = confirmText;
      if ($btnCancel) {
        $btnCancel.textContent = cancelText;
        $btnCancel.classList.remove('hidden');
      }
      $modal.classList.remove('hidden');
    });
  };

  function initDialogModal() {
    const $modal = document.getElementById('flow-dialog-modal');
    const $btnConfirm = document.getElementById('flow-dialog-confirm-btn');
    const $btnCancel = document.getElementById('flow-dialog-cancel-btn');

    $btnConfirm?.addEventListener('click', () => {
      $modal?.classList.add('hidden');
      if (currentDialogResolver) {
        const res = currentDialogResolver;
        currentDialogResolver = null;
        res(true);
      }
    });

    $btnCancel?.addEventListener('click', () => {
      $modal?.classList.add('hidden');
      if (currentDialogResolver) {
        const res = currentDialogResolver;
        currentDialogResolver = null;
        res(false);
      }
    });

    $modal?.addEventListener('click', (e) => {
      if (e.target === $modal) {
        $modal.classList.add('hidden');
        if (currentDialogResolver) {
          const res = currentDialogResolver;
          currentDialogResolver = null;
          res(false);
        }
      }
    });
  }

  // ==========================================
  // App Lifecycle & Initialization
  // ==========================================

  document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initClock();
    initDialogModal();
    initTabNavigation();
    initJobBoardsManagement();
    initProjectManagement();
    initColumnsManagement();
    initCalendar();
    initSecurityManagement();
    initDeadlineAlertBanner();
    setupStrictExit();
    initAuthTabs();
  });

  // Tab switching
  function switchTab(targetId) {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
        btn.classList.add('bg-cyan-950/40');
        btn.classList.add('text-cyan-400');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('bg-cyan-950/40');
        btn.classList.remove('text-cyan-400');
      }
    });

    document.querySelectorAll('.flow-tab-panel').forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (targetId === 'panel-calendar') {
      renderCalendar();
    } else if (targetId === 'panel-new-proj') {
      renderAddTaskPanel();
    }
  }
  window.flowSwitchTab = switchTab;

  function initTabNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        if (target === 'panel-new-proj') {
          // Always require choosing a job board first when clicking navigation tab
          selectedAddTaskBoardId = null;
        }
        if (target) switchTab(target);
      });
    });
  }

  function setupStrictExit() {
    document.querySelectorAll('.exit-to-portfolio-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await fetch('api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin' });
        } catch (err) {}
        window.location.href = 'index.html';
      });
    });
  }

  // ==========================================
  // Authentication & Session
  // ==========================================

  function initAuthTabs() {
    if ($tabBtnSignin && $tabBtnRegister) {
      $tabBtnSignin.addEventListener('click', () => {
        $tabBtnSignin.className = 'py-2 px-3 rounded-lg text-center transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md cursor-pointer flex items-center justify-center gap-2';
        $tabBtnRegister.className = 'py-2 px-3 rounded-lg text-center transition-all text-slate-400 hover:text-white cursor-pointer flex items-center justify-center gap-2';
        if ($loginForm) $loginForm.classList.remove('hidden');
        if ($registerForm) $registerForm.classList.add('hidden');
        if ($loginFeedback) $loginFeedback.classList.add('hidden');
      });

      $tabBtnRegister.addEventListener('click', () => {
        $tabBtnRegister.className = 'py-2 px-3 rounded-lg text-center transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md cursor-pointer flex items-center justify-center gap-2';
        $tabBtnSignin.className = 'py-2 px-3 rounded-lg text-center transition-all text-slate-400 hover:text-white cursor-pointer flex items-center justify-center gap-2';
        if ($registerForm) $registerForm.classList.remove('hidden');
        if ($loginForm) $loginForm.classList.add('hidden');
        if ($loginFeedback) $loginFeedback.classList.add('hidden');
      });
    }

    if ($togglePasswordBtn && $loginPass) {
      $togglePasswordBtn.addEventListener('click', () => {
        const isPass = $loginPass.type === 'password';
        $loginPass.type = isPass ? 'text' : 'password';
        $togglePasswordBtn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash text-sm"></i>' : '<i class="fa-solid fa-eye text-sm"></i>';
      });
    }

    if ($toggleRegPasswordBtn && $regPass) {
      $toggleRegPasswordBtn.addEventListener('click', () => {
        const isPass = $regPass.type === 'password';
        $regPass.type = isPass ? 'text' : 'password';
        if ($regConfirm) $regConfirm.type = isPass ? 'text' : 'password';
        $toggleRegPasswordBtn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash text-sm"></i>' : '<i class="fa-solid fa-eye text-sm"></i>';
      });
    }

    // Sign in form submit
    if ($loginForm) {
      $loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = $loginUser?.value.trim() || '';
        const password = $loginPass?.value || '';

        if (!username || !password) {
          showLogin('Please enter both username and password.', true);
          return;
        }

        if ($loginBtnText) $loginBtnText.classList.add('hidden');
        if ($loginBtnSpinner) $loginBtnSpinner.classList.remove('hidden');
        if ($loginBtn) $loginBtn.disabled = true;

        try {
          const res = await fetch('api/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'same-origin'
          });
          const json = await res.json();

          if (res.ok && json.success) {
            const userDisplay = document.getElementById('current-user-display');
            if (userDisplay && json.user) userDisplay.textContent = 'user: ' + json.user.username;
            showDashboard();
          } else {
            showLogin(json.error || 'Access Denied: Invalid credentials.', true);
          }
        } catch (err) {
          showLogin('Unable to connect to server: ' + err.message, true);
        } finally {
          if ($loginBtnText) $loginBtnText.classList.remove('hidden');
          if ($loginBtnSpinner) $loginBtnSpinner.classList.add('hidden');
          if ($loginBtn) $loginBtn.disabled = false;
        }
      });
    }

    // Register form submit
    if ($registerForm) {
      $registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = $regUser?.value.trim() || '';
        const password = $regPass?.value || '';
        const confirmPassword = $regConfirm?.value || '';

        if (!username || !password || !confirmPassword) {
          showLogin('Please fill in all registration fields.', true);
          return;
        }
        if (password !== confirmPassword) {
          showLogin('Passwords do not match.', true);
          return;
        }

        if ($regBtnText) $regBtnText.classList.add('hidden');
        if ($regBtnSpinner) $regBtnSpinner.classList.remove('hidden');
        if ($regBtn) $regBtn.disabled = true;

        try {
          const res = await fetch('api/auth.php?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPassword }),
            credentials: 'same-origin'
          });
          const json = await res.json();

          if (res.ok && json.success) {
            const userDisplay = document.getElementById('current-user-display');
            if (userDisplay && json.user) userDisplay.textContent = 'user: ' + json.user.username;
            showDashboard();
          } else {
            showLogin(json.error || 'Registration failed.', true);
          }
        } catch (err) {
          showLogin('Registration connection error: ' + err.message, true);
        } finally {
          if ($regBtnText) $regBtnText.classList.remove('hidden');
          if ($regBtnSpinner) $regBtnSpinner.classList.add('hidden');
          if ($regBtn) $regBtn.disabled = false;
        }
      });
    }
  }

  async function checkSession() {
    try {
      const res = await fetch('api/auth.php?action=check', { credentials: 'same-origin' });
      const data = await res.json();
      if (data.success && data.authenticated) {
        const userDisplay = document.getElementById('current-user-display');
        const username = (data.user && data.user.username) || data.username || 'User';
        if (userDisplay) userDisplay.textContent = 'user: ' + username;
        showDashboard();
        return;
      }
    } catch (e) {
      console.warn('Session verification error:', e);
    }
    showLogin();
  }

  function showLogin(msg, isError) {
    if ($loginGate) $loginGate.classList.remove('hidden');
    if ($adminApp) $adminApp.classList.add('hidden');
    if ($loginFeedback && msg) {
      $loginFeedback.textContent = msg;
      $loginFeedback.className = isError
        ? 'text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-lg p-2.5 flex items-center gap-2 mb-4'
        : 'text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2.5 flex items-center gap-2 mb-4';
      $loginFeedback.classList.remove('hidden');
    } else if ($loginFeedback) {
      $loginFeedback.classList.add('hidden');
    }
    if ($loginPass) $loginPass.value = '';
    if ($loginUser) {
      $loginUser.value = '';
      setTimeout(() => $loginUser.focus(), 150);
    }
  }

  function showDashboard() {
    if ($loginGate) $loginGate.classList.add('hidden');
    if ($adminApp) $adminApp.classList.remove('hidden');
    syncAllData();
  }

  // Live top-right clock
  function initClock() {
    const $clock = document.getElementById('flow-clock');
    const $date = document.getElementById('flow-date');

    function update() {
      const d = new Date();
      if ($clock) {
        $clock.textContent = d.toLocaleTimeString('en-US', { hour12: false });
      }
      if ($date) {
        $date.textContent = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
    }
    update();
    setInterval(update, 1000);
  }

  // ==========================================
  // Workspace & Settings Modal (Preferences, Username, Password)
  // ==========================================

  function initSecurityManagement() {
    const $btnOpen = document.getElementById('btn-open-security-modal');
    const $modal = document.getElementById('security-modal-dialog');
    const $btnClose = document.getElementById('btn-close-security-modal');
    const $cancelBtns = document.querySelectorAll('.btn-cancel-account-modal');
    const $feedback = document.getElementById('security-modal-feedback');

    const $tabPrefs = document.getElementById('tab-opt-prefs');
    const $tabJobs = document.getElementById('tab-opt-jobs');
    const $tabUsername = document.getElementById('tab-opt-username');
    const $tabPassword = document.getElementById('tab-opt-password');

    const $formPrefs = document.getElementById('form-workspace-prefs');
    const $sectionJobs = document.getElementById('section-manage-jobs');
    const $formUsername = document.getElementById('form-change-username');
    const $formPassword = document.getElementById('form-change-password');

    function selectTab(tab) {
      if ($feedback) {
        $feedback.className = 'hidden';
        $feedback.textContent = '';
      }

      const tabs = [
        { id: 'prefs', tabEl: $tabPrefs, formEl: $formPrefs },
        { id: 'jobs', tabEl: $tabJobs, formEl: $sectionJobs },
        { id: 'username', tabEl: $tabUsername, formEl: $formUsername },
        { id: 'password', tabEl: $tabPassword, formEl: $formPassword }
      ];

      tabs.forEach(t => {
        if (!t.tabEl || !t.formEl) return;
        if (t.id === tab) {
          t.formEl.classList.remove('hidden');
          t.tabEl.className = 'account-setting-tab flex-1 py-2 px-2.5 rounded-lg font-bold transition-all bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer';
        } else {
          t.formEl.classList.add('hidden');
          t.tabEl.className = 'account-setting-tab flex-1 py-2 px-2.5 rounded-lg font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer';
        }
      });

      if (tab === 'jobs' && typeof renderManageJobsModal === 'function') {
        renderManageJobsModal();
      }
    }

    if ($tabPrefs) $tabPrefs.addEventListener('click', () => selectTab('prefs'));
    if ($tabJobs) $tabJobs.addEventListener('click', () => selectTab('jobs'));
    if ($tabUsername) $tabUsername.addEventListener('click', () => selectTab('username'));
    if ($tabPassword) $tabPassword.addEventListener('click', () => selectTab('password'));

    function openModal(defaultTab = 'prefs') {
      const curSelect = document.getElementById('pref-currency-select');
      const alertSelect = document.getElementById('pref-deadline-alert');

      if (curSelect) curSelect.value = userSettings.currency || '$';
      if (alertSelect) alertSelect.value = String(userSettings.deadlineAlertDays !== undefined ? userSettings.deadlineAlertDays : 1);

      selectTab(defaultTab);
      if ($modal) $modal.classList.remove('hidden');
    }

    function closeModal() {
      if ($modal) $modal.classList.add('hidden');
    }

    window.flowOpenAccountModal = openModal;
    window.flowCloseAccountModal = closeModal;
    window.flowOpenManageJobs = function () {
      openModal('jobs');
    };
    window.flowCloseManageJobs = function () {
      closeModal();
    };

    if ($btnOpen) $btnOpen.addEventListener('click', () => openModal('prefs'));
    if ($btnClose) $btnClose.addEventListener('click', closeModal);
    $cancelBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if ($modal) {
      $modal.addEventListener('click', (e) => {
        if (e.target === $modal) closeModal();
      });
    }

    // Save preferences
    if ($formPrefs) {
      $formPrefs.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldCur = userSettings.currency || '$';
        const newCur = document.getElementById('pref-currency-select')?.value || '$';
        const alertDays = parseInt(document.getElementById('pref-deadline-alert')?.value, 10);

        const btnSpinner = document.getElementById('prefs-btn-spinner');
        const btnText = document.getElementById('prefs-btn-text');
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        if (btnText) btnText.classList.add('hidden');

        // Real-time Currency Conversion:
        // When changing between USD ($) and PHP (₱), convert existing project rates in DB
        if (oldCur !== newCur && cachedProjects.length > 0) {
          for (const proj of cachedProjects) {
            const convertedPrice = convertCurrencyAmount(proj.price, oldCur, newCur);
            const convertedBudget = convertCurrencyAmount(proj.budget, oldCur, newCur);
            const convertedPaid = convertCurrencyAmount(proj.paid_amount, oldCur, newCur);

            proj.price = convertedPrice;
            proj.budget = convertedBudget;
            proj.paid_amount = convertedPaid;

            await updateProjectApi(proj.id, {
              price: convertedPrice,
              budget: convertedBudget,
              paid_amount: convertedPaid
            });
          }
        }

        const updatedSettings = {
          currency: newCur,
          deadlineAlertDays: isNaN(alertDays) ? 1 : alertDays
        };

        await saveUserSettings(updatedSettings);

        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btnText) btnText.classList.remove('hidden');

        updateCurrencyDisplays();
        renderAll();
        showFeedback(`Preferences saved! All rates converted to ${newCur === '₱' ? 'PHP (₱)' : 'USD ($)'}.`, false);
      });
    }

    // Change Username
    if ($formUsername) {
      $formUsername.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('input-user-current-pass')?.value || '';
        const newUsername = document.getElementById('input-new-username')?.value.trim() || '';

        if (!currentPass || !newUsername) {
          showFeedback('All fields are required.', true);
          return;
        }

        const btnSubmit = document.getElementById('btn-submit-username');
        const btnText = document.getElementById('username-btn-text');
        const btnSpinner = document.getElementById('username-btn-spinner');

        if (btnText) btnText.classList.add('hidden');
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        if (btnSubmit) btnSubmit.disabled = true;

        try {
          const res = await fetch('api/auth.php?action=change_username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword: currentPass, newUsername }),
            credentials: 'same-origin'
          });
          const json = await res.json();

          if (res.ok && json.success) {
            const userDisplay = document.getElementById('current-user-display');
            if (userDisplay) userDisplay.textContent = 'user: ' + json.username;
            showFeedback('Username updated successfully!', false);
            $formUsername.reset();
          } else {
            showFeedback(json.error || 'Failed to update username.', true);
          }
        } catch (err) {
          showFeedback('Connection error: ' + err.message, true);
        } finally {
          if (btnText) btnText.classList.remove('hidden');
          if (btnSpinner) btnSpinner.classList.add('hidden');
          if (btnSubmit) btnSubmit.disabled = false;
        }
      });
    }

    // Change Password
    if ($formPassword) {
      $formPassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('input-pass-current')?.value || '';
        const newPass = document.getElementById('input-pass-new')?.value || '';
        const confirmPass = document.getElementById('input-pass-confirm')?.value || '';

        if (!oldPass || !newPass || !confirmPass) {
          showFeedback('All fields are required.', true);
          return;
        }
        if (newPass !== confirmPass) {
          showFeedback('New passwords do not match.', true);
          return;
        }
        if (newPass.length < 2) {
          showFeedback('Password must be at least 2 characters.', true);
          return;
        }

        const btnSubmit = document.getElementById('btn-submit-password');
        const btnText = document.getElementById('pass-btn-text');
        const btnSpinner = document.getElementById('pass-btn-spinner');

        if (btnText) btnText.classList.add('hidden');
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        if (btnSubmit) btnSubmit.disabled = true;

        try {
          const res = await fetch('api/auth.php?action=change_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
            credentials: 'same-origin'
          });
          const json = await res.json();

          if (res.ok && json.success) {
            closeModal();
            $formPassword.reset();
            showLogin('Password updated successfully. Please sign in with your new password.', false);
          } else {
            showFeedback(json.error || 'Failed to update password.', true);
          }
        } catch (err) {
          showFeedback('Connection error: ' + err.message, true);
        } finally {
          if (btnText) btnText.classList.remove('hidden');
          if (btnSpinner) btnSpinner.classList.add('hidden');
          if (btnSubmit) btnSubmit.disabled = false;
        }
      });
    }

    function showFeedback(msg, isError) {
      if (!$feedback) return;
      $feedback.textContent = msg;
      $feedback.className = isError
        ? 'block mb-4 p-2.5 rounded-lg text-xs font-mono text-rose-400 bg-rose-950/50 border border-rose-500/40'
        : 'block mb-4 p-2.5 rounded-lg text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40';
    }
  }

  // ==========================================
  // Dynamic Custom Fields in Forms
  // ==========================================

  function renderCustomFieldInputs(containerId, currentValues = {}, boardId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const targetBoardId = boardId || userSettings.activeBoardId;
    const board = (userSettings.boards || []).find(b => b.id === targetBoardId) || getActiveBoard();
    const cols = (board.columns || []).filter(c => c.visible !== false);
    if (cols.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="pt-2 border-t border-slate-800">
        <div class="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <i class="fa-solid fa-table-columns"></i>
            <span>${escapeHtml(board.name || 'Job')} Custom Columns</span>
          </span>
          <span class="text-[10px] text-slate-500 font-mono">${cols.length} field${cols.length === 1 ? '' : 's'}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${cols.map(col => {
            const rawVal = currentValues[col.id] !== undefined ? currentValues[col.id] : '';
            let inputHtml = '';
            if (col.type === 'number') {
              inputHtml = `<input type="number" step="any" data-custom-id="${col.id}" value="${escapeHtml(rawVal)}" class="custom-field-input w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">`;
            } else if (col.type === 'date') {
              inputHtml = `<input type="date" data-custom-id="${col.id}" value="${escapeHtml(rawVal)}" class="custom-field-input w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">`;
            } else if (col.type === 'url') {
              inputHtml = `<input type="url" data-custom-id="${col.id}" value="${escapeHtml(rawVal)}" placeholder="https://..." class="custom-field-input w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">`;
            } else {
              inputHtml = `<input type="text" data-custom-id="${col.id}" value="${escapeHtml(rawVal)}" class="custom-field-input w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">`;
            }
            return `
              <div>
                <label class="block text-xs font-mono text-slate-300 uppercase mb-1">${escapeHtml(col.label)}</label>
                ${inputHtml}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function getCustomFieldValues(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return {};
    const values = {};
    container.querySelectorAll('.custom-field-input').forEach(input => {
      const id = input.getAttribute('data-custom-id');
      if (id) {
        values[id] = input.value.trim();
      }
    });
    return values;
  }

  // ==========================================
  // Custom Columns & Presets Manager
  // ==========================================

  function initColumnsManagement() {
    // 1. Preset Selector dropdown in toolbar
    const $presetSelect = document.getElementById('task-preset-select');
    if ($presetSelect) {
      $presetSelect.addEventListener('change', async (e) => {
        const key = e.target.value;
        if (DEFAULT_PRESETS[key]) {
          userSettings.activePreset = key;
          userSettings.customColumns = JSON.parse(JSON.stringify(DEFAULT_PRESETS[key].columns));
          await saveUserSettings(userSettings);
          renderAll();
        }
      });
    }

    // 2. Add Custom Column Modal
    const $addColModal = document.getElementById('custom-column-modal');
    const $btnOpenAddCol = document.getElementById('btn-open-add-column');
    const $btnCloseAddCol = document.getElementById('btn-close-add-column-modal');
    const $btnCancelAddCol = document.getElementById('btn-cancel-add-column');
    const $addColForm = document.getElementById('add-column-form');

    function openAddColModal() {
      if ($addColForm) $addColForm.reset();
      if ($addColModal) $addColModal.classList.remove('hidden');
    }
    function closeAddColModal() {
      if ($addColModal) $addColModal.classList.add('hidden');
    }

    if ($btnOpenAddCol) $btnOpenAddCol.addEventListener('click', openAddColModal);
    if ($btnCloseAddCol) $btnCloseAddCol.addEventListener('click', closeAddColModal);
    if ($btnCancelAddCol) $btnCancelAddCol.addEventListener('click', closeAddColModal);
    if ($addColModal) {
      $addColModal.addEventListener('click', (e) => {
        if (e.target === $addColModal) closeAddColModal();
      });
    }

    // Preset suggestion pills
    document.querySelectorAll('.btn-col-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.getAttribute('data-label');
        const type = btn.getAttribute('data-type');
        const lInput = document.getElementById('new-col-label');
        const tInput = document.getElementById('new-col-type');
        if (lInput) lInput.value = label;
        if (tInput) tInput.value = type;
      });
    });

    if ($addColForm) {
      $addColForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const label = document.getElementById('new-col-label')?.value.trim();
        const type = document.getElementById('new-col-type')?.value || 'text';

        if (!label) return;

        const safeId = 'col_' + label.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);
        const newCol = {
          id: safeId,
          label,
          type,
          icon: type === 'url' ? 'fa-link' : type === 'number' ? 'fa-hashtag' : 'fa-tag',
          visible: true
        };

        const activeBoard = getActiveBoard();
        if (!Array.isArray(activeBoard.columns)) {
          activeBoard.columns = [];
        }
        activeBoard.columns.push(newCol);

        await saveUserSettings(userSettings);
        closeAddColModal();
        renderAll();
      });
    }

    // 3. Manage Columns Modal
    const $manageModal = document.getElementById('manage-columns-modal');
    const $btnOpenManage = document.getElementById('btn-open-manage-columns');
    const $btnCloseManage = document.getElementById('btn-close-manage-columns-modal');
    const $btnSaveManage = document.getElementById('btn-save-manage-columns');
    const $btnAddFromManage = document.getElementById('btn-add-col-from-manage');

    function renderManageColumnsList() {
      const container = document.getElementById('manage-columns-list');
      if (!container) return;

      const activeBoard = getActiveBoard();
      const cols = activeBoard.columns || [];
      if (cols.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 italic p-3 text-center">No custom columns added to ${escapeHtml(activeBoard.name || 'this board')} yet.</div>`;
        return;
      }

      container.innerHTML = cols.map((col, idx) => {
        const isVis = col.visible !== false;
        return `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div class="flex items-center gap-2">
              <i class="fa-solid ${col.type === 'url' ? 'fa-link text-cyan-400' : col.type === 'number' ? 'fa-hashtag text-amber-400' : 'fa-tag text-purple-400'} text-xs w-4 text-center"></i>
              <span class="font-bold text-white">${escapeHtml(col.label)}</span>
              <span class="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800">${col.type}</span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" class="btn-toggle-col-vis px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isVis ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'
              }" data-col-id="${col.id}" title="${isVis ? 'Hide Column' : 'Show Column'}">
                <i class="fa-solid ${isVis ? 'fa-eye' : 'fa-eye-slash'} mr-1"></i>
                <span>${isVis ? 'Visible' : 'Hidden'}</span>
              </button>
              <button type="button" class="btn-remove-col p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer" data-col-id="${col.id}" title="Delete Column">
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Wire toggle visibility
      container.querySelectorAll('.btn-toggle-col-vis').forEach(btn => {
        btn.addEventListener('click', async () => {
          const colId = btn.getAttribute('data-col-id');
          const activeBoard = getActiveBoard();
          const target = (activeBoard.columns || []).find(c => c.id === colId);
          if (target) {
            target.visible = target.visible === false ? true : false;
            await saveUserSettings(userSettings);
            renderManageColumnsList();
            renderAll();
          }
        });
      });

      // Wire delete column
      container.querySelectorAll('.btn-remove-col').forEach(btn => {
        btn.addEventListener('click', async () => {
          const colId = btn.getAttribute('data-col-id');
          const activeBoard = getActiveBoard();
          if (confirm('Delete this column from this job board? Data in this column will be hidden.')) {
            activeBoard.columns = (activeBoard.columns || []).filter(c => c.id !== colId);
            await saveUserSettings(userSettings);
            renderManageColumnsList();
            renderAll();
          }
        });
      });
    }

    function openManageModal() {
      renderManageColumnsList();
      if ($manageModal) $manageModal.classList.remove('hidden');
    }
    function closeManageModal() {
      if ($manageModal) $manageModal.classList.add('hidden');
    }

    if ($btnOpenManage) $btnOpenManage.addEventListener('click', openManageModal);
    if ($btnCloseManage) $btnCloseManage.addEventListener('click', closeManageModal);
    if ($btnSaveManage) $btnSaveManage.addEventListener('click', closeManageModal);
    if ($manageModal) {
      $manageModal.addEventListener('click', (e) => {
        if (e.target === $manageModal) closeManageModal();
      });
    }
    if ($btnAddFromManage) {
      $btnAddFromManage.addEventListener('click', () => {
        closeManageModal();
        openAddColModal();
      });
    }

    // Preset buttons inside manage columns
    document.querySelectorAll('.btn-apply-preset').forEach(btn => {
      btn.addEventListener('click', async () => {
        const presetKey = btn.getAttribute('data-preset');
        if (DEFAULT_PRESETS[presetKey]) {
          const activeBoard = getActiveBoard();
          activeBoard.columns = JSON.parse(JSON.stringify(DEFAULT_PRESETS[presetKey].columns));
          await saveUserSettings(userSettings);
          renderManageColumnsList();
          renderAll();
        }
      });
    });
  }

  // ==========================================
  // Job Boards & Profession System
  // ==========================================

  function renderSidebarJobBoards() {
    const $tree = document.getElementById('sidebar-job-boards-tree');
    const $totalBadge = document.getElementById('sidebar-total-tasks-badge');
    const $caret = document.getElementById('task-tracker-caret');

    if ($totalBadge) {
      $totalBadge.textContent = cachedProjects.length;
    }

    if ($caret) {
      if (sidebarAccordionExpanded) {
        $caret.classList.remove('-rotate-90');
      } else {
        $caret.classList.add('-rotate-90');
      }
    }

    if (!$tree) return;

    if (!sidebarAccordionExpanded) {
      $tree.classList.add('hidden');
      return;
    }
    $tree.classList.remove('hidden');

    const boards = userSettings.boards || [];
    const activeId = userSettings.activeBoardId;

    if (boards.length === 0) {
      $tree.innerHTML = `
        <div class="px-2 py-2">
          <button 
            type="button"
            onclick="window.flowOpenManageJobs()"
            class="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
            title="Choose your freelance disciplines"
          >
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span>Add Job Board</span>
          </button>
        </div>
      `;
      return;
    }

    // Count tasks per board
    const boardCounts = {};
    cachedProjects.forEach(p => {
      const bId = p.boardId || (boards[0] ? boards[0].id : '');
      boardCounts[bId] = (boardCounts[bId] || 0) + 1;
    });

    const boardItemsHtml = boards.map(b => {
      const isActive = activeId === b.id;
      const count = boardCounts[b.id] || 0;
      return `
        <button 
          type="button" 
          onclick="window.flowSetActiveBoard('${b.id}')"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left group cursor-pointer ${
            isActive
              ? 'bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
          }"
        >
          <div class="flex items-center gap-2 truncate">
            <i class="fa-solid ${b.icon || 'fa-briefcase'} text-[11px] ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'} w-3.5 text-center flex-shrink-0"></i>
            <span class="truncate">${escapeHtml(b.name)}</span>
          </div>
          <span class="text-[10px] font-mono px-1.5 py-0.2 rounded ${
            isActive ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-500/40' : 'bg-slate-800/80 text-slate-500 group-hover:text-slate-300'
          }">${count}</span>
        </button>
      `;
    }).join('');

    const isAllActive = activeId === 'all';
    const allBoardHtml = boards.length > 1 ? `
      <button 
        type="button" 
        onclick="window.flowSetActiveBoard('all')"
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left group cursor-pointer ${
          isAllActive
            ? 'bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
        }"
      >
        <div class="flex items-center gap-2 truncate">
          <i class="fa-solid fa-layer-group text-[11px] ${isAllActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'} w-3.5 text-center flex-shrink-0"></i>
          <span class="truncate">All Jobs (Master)</span>
        </div>
        <span class="text-[10px] font-mono px-1.5 py-0.2 rounded ${
          isAllActive ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-500/40' : 'bg-slate-800/80 text-slate-500 group-hover:text-slate-300'
        }">${cachedProjects.length}</span>
      </button>
    ` : '';

    const manageBtnHtml = `
      <button 
        type="button"
        onclick="window.flowOpenManageJobs()"
        class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30 border border-dashed border-slate-800 hover:border-cyan-500/40 transition-all text-left cursor-pointer mt-1"
        title="Add or remove job disciplines"
      >
        <i class="fa-solid fa-plus text-[10px] text-cyan-400"></i>
        <span>Add / Manage Jobs</span>
      </button>
    `;

    $tree.innerHTML = boardItemsHtml + allBoardHtml + manageBtnHtml;
  }

  function renderBoardQuickPills() {
    const $container = document.getElementById('board-quick-pills');
    if (!$container) return;

    const boards = userSettings.boards || [];
    const activeId = userSettings.activeBoardId;

    if (boards.length === 0) {
      $container.innerHTML = `
        <button 
          type="button" 
          onclick="window.flowOpenManageJobs()"
          class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <i class="fa-solid fa-plus"></i>
          <span>Add Job Board</span>
        </button>
      `;
      return;
    }

    const pillsHtml = boards.map(b => {
      const isActive = activeId === b.id;
      return `
        <button 
          type="button" 
          onclick="window.flowSetActiveBoard('${b.id}')"
          class="px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            isActive
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80'
          }"
        >
          <i class="fa-solid ${b.icon || 'fa-briefcase'} text-[11px]"></i>
          <span>${escapeHtml(b.name)}</span>
        </button>
      `;
    }).join('');

    const isAll = activeId === 'all';
    const allPillHtml = boards.length > 1 ? `
      <button 
        type="button" 
        onclick="window.flowSetActiveBoard('all')"
        class="px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
          isAll
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
            : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80'
        }"
      >
        <i class="fa-solid fa-layer-group text-[11px]"></i>
        <span>All Jobs</span>
      </button>
    ` : '';

    $container.innerHTML = pillsHtml + allPillHtml;
  }

  function updateBoardHeader() {
    const activeBoard = getActiveBoard();
    const isMaster = userSettings.activeBoardId === 'all';

    const $icon = document.getElementById('current-board-icon');
    const $badge = document.getElementById('current-board-badge');
    const $title = document.getElementById('current-board-title');
    const $desc = document.getElementById('current-board-desc');
    const $subtext = document.getElementById('current-board-subtext');

    if (!activeBoard) {
      if ($icon) $icon.className = 'fa-solid fa-briefcase';
      if ($badge) $badge.textContent = 'Workspace';
      if ($title) $title.textContent = 'Task';
      if ($subtext) $subtext.textContent = 'Getting Started';
      if ($desc) $desc.textContent = 'Add your first freelance job board to start tracking tasks and rates.';
      return;
    }

    if ($icon) $icon.className = `fa-solid ${activeBoard.icon || 'fa-briefcase'}`;
    if ($badge) $badge.textContent = activeBoard.name;
    if ($title) $title.textContent = activeBoard.name;
    if ($subtext) $subtext.textContent = isMaster ? 'Master Overview' : 'Dedicated Workspace Table';
    if ($desc) {
      $desc.textContent = isMaster 
        ? 'Viewing all tasks across all your active freelance disciplines.' 
        : `Track deliverables, rates, deadlines, and status for ${activeBoard.name}.`;
    }
  }

  function renderManageJobsModal() {
    const boards = userSettings.boards || [];
    const activeId = userSettings.activeBoardId;

    const $countText = document.getElementById('manage-jobs-count-text');
    if ($countText) {
      $countText.textContent = `${boards.length} Active Board${boards.length === 1 ? '' : 's'}`;
    }

    // Render active boards list
    const $activeList = document.getElementById('manage-active-jobs-list');
    if ($activeList) {
      if (boards.length === 0) {
        $activeList.innerHTML = `
          <div class="p-4 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            No active job boards added yet. Choose a preset below or create a custom board!
          </div>
        `;
      } else {
        const boardCounts = {};
        cachedProjects.forEach(p => {
          const bId = p.boardId || (boards[0] ? boards[0].id : '');
          boardCounts[bId] = (boardCounts[bId] || 0) + 1;
        });

        $activeList.innerHTML = boards.map((b) => {
          const isCurrent = activeId === b.id;
          const taskCount = boardCounts[b.id] || 0;
          const unfinishedCount = cachedProjects.filter(p => {
            const bId = p.boardId || (boards[0] ? boards[0].id : '');
            if (bId !== b.id) return false;
            const st = p.status || 'Not Started';
            return st !== 'Published' && st !== 'Completed';
          }).length;

          return `
            <div class="p-3 rounded-xl bg-slate-900 border ${isCurrent ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800'} flex items-center justify-between gap-3 text-xs font-mono">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-sm flex-shrink-0">
                  <i class="fa-solid ${b.icon || 'fa-briefcase'}"></i>
                </div>
                <div>
                  <div class="font-bold text-white flex items-center gap-2">
                    <span>${escapeHtml(b.name)}</span>
                    ${isCurrent ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">Active</span>' : ''}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    <span>${taskCount} task${taskCount === 1 ? '' : 's'}</span>
                    <span class="text-slate-600">&bull;</span>
                    <span>${(b.columns || []).length} custom column${(b.columns || []).length === 1 ? '' : 's'}</span>
                    ${unfinishedCount > 0 ? `<span class="text-slate-600">&bull;</span><span class="text-amber-400/90 font-semibold">${unfinishedCount} active</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                ${
                  !isCurrent 
                    ? `<button type="button" onclick="window.flowSetActiveBoard('${b.id}'); window.flowCloseManageJobs();" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer">
                        Switch
                      </button>`
                    : `<span class="text-[11px] text-cyan-400 font-bold px-2 py-1">Viewing</span>`
                }
                <button 
                  type="button" 
                  onclick="window.flowRemoveJobBoard('${b.id}')" 
                  class="p-1.5 rounded-lg transition-colors cursor-pointer ${
                    unfinishedCount > 0 
                      ? 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-950/40' 
                      : 'text-slate-500 hover:text-rose-400 hover:bg-rose-950/30'
                  }" 
                  title="${unfinishedCount > 0 ? `${unfinishedCount} task(s) in progress/not started - complete or delete tasks first` : 'Remove this job board'}"
                >
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render preset library grid
    const $presetGrid = document.getElementById('manage-preset-library-grid');
    if ($presetGrid) {
      $presetGrid.innerHTML = Object.entries(DEFAULT_PRESETS).map(([key, preset]) => {
        const isAlreadyAdded = boards.some(b => b.presetKey === key || b.id === key);
        return `
          <div class="p-3 rounded-xl bg-slate-900/80 border ${isAlreadyAdded ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-cyan-500/40'} flex items-center justify-between gap-2 text-xs font-mono transition-all">
            <div class="flex items-center gap-2.5 truncate">
              <div class="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0">
                <i class="fa-solid ${preset.icon}"></i>
              </div>
              <div class="truncate">
                <div class="font-bold text-white truncate">${escapeHtml(preset.name)}</div>
                <div class="text-[10px] text-slate-500">${preset.columns.length} columns</div>
              </div>
            </div>
            <div>
              ${
                isAlreadyAdded 
                  ? `<span class="px-2 py-1 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <i class="fa-solid fa-check text-[9px]"></i> Added
                    </span>`
                  : `<button type="button" onclick="window.flowAddPresetJobBoard('${key}')" class="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
                      <i class="fa-solid fa-plus text-[10px]"></i> Add
                    </button>`
              }
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function initJobBoardsManagement() {
    // Accordion toggle button on sidebar
    const $toggleBtn = document.getElementById('nav-task-tracker-toggle');
    if ($toggleBtn) {
      $toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentPanel = document.querySelector('.flow-tab-panel:not(.hidden)')?.id;
        if (currentPanel !== 'panel-projects') {
          switchTab('panel-projects');
          sidebarAccordionExpanded = true;
          renderSidebarJobBoards();
        } else {
          sidebarAccordionExpanded = !sidebarAccordionExpanded;
          renderSidebarJobBoards();
        }
      });
    }

    // Open/Close Manage Jobs modal
    const $modal = document.getElementById('manage-jobs-modal');
    const $btnOpenTop = document.getElementById('btn-open-manage-jobs-top');
    const $btnClose = document.getElementById('btn-close-manage-jobs-modal');
    const $btnCloseFooter = document.getElementById('btn-close-manage-jobs-footer');

    window.flowOpenManageJobs = function () {
      renderManageJobsModal();
      if ($modal) $modal.classList.remove('hidden');
    };

    window.flowCloseManageJobs = function () {
      if ($modal) $modal.classList.add('hidden');
    };

    if ($btnOpenTop) $btnOpenTop.addEventListener('click', window.flowOpenManageJobs);
    if ($btnClose) $btnClose.addEventListener('click', window.flowCloseManageJobs);
    if ($btnCloseFooter) $btnCloseFooter.addEventListener('click', window.flowCloseManageJobs);
    if ($modal) {
      $modal.addEventListener('click', (e) => {
        if (e.target === $modal) window.flowCloseManageJobs();
      });
    }

    // Add preset job board
    window.flowAddPresetJobBoard = async function (presetKey) {
      const preset = DEFAULT_PRESETS[presetKey];
      if (!preset) return;

      const boards = userSettings.boards || [];
      if (boards.some(b => b.presetKey === presetKey || b.id === presetKey)) return;

      const newBoard = {
        id: presetKey,
        name: preset.name,
        icon: preset.icon,
        presetKey: presetKey,
        columns: JSON.parse(JSON.stringify(preset.columns))
      };

      boards.push(newBoard);
      userSettings.boards = boards;
      userSettings.activeBoardId = newBoard.id;

      await saveUserSettings(userSettings);
      renderManageJobsModal();
      renderAll();
    };

    // Remove job board
    window.flowRemoveJobBoard = async function (boardId) {
      const boards = userSettings.boards || [];
      const boardToRemove = boards.find(b => b.id === boardId);
      if (!boardToRemove) return;

      // Check if there are active tasks (In Progress or Not Started) for this board
      const unfinishedTasks = cachedProjects.filter(p => {
        const bId = p.boardId || (boards[0] ? boards[0].id : '');
        if (bId !== boardId) return false;
        const st = p.status || 'Not Started';
        return st !== 'Published' && st !== 'Completed';
      });

      if (unfinishedTasks.length > 0) {
        await window.flowAlert({
          title: 'Cannot Delete Board',
          message: `Cannot remove "${boardToRemove.name}": You still have ${unfinishedTasks.length} active task(s) currently In Progress or Not Started.\n\nPlease finish or delete these active tasks before removing this job board.`,
          icon: 'fa-triangle-exclamation',
          type: 'warning',
          confirmText: 'Understood'
        });
        return;
      }

      const confirmed = await window.flowConfirm({
        title: 'Remove Job Board',
        message: `Remove "${boardToRemove.name}" from your active job boards?`,
        icon: 'fa-trash-can',
        type: 'danger',
        confirmText: 'Remove Board'
      });

      if (!confirmed) {
        return;
      }

      userSettings.boards = boards.filter(b => b.id !== boardId);
      if (userSettings.activeBoardId === boardId) {
        userSettings.activeBoardId = userSettings.boards[0]?.id || '';
      }

      await saveUserSettings(userSettings);
      renderManageJobsModal();
      renderAddTaskPanel();
      renderAll();
    };

    // Create custom job board
    const $btnCreateCustom = document.getElementById('btn-create-custom-job');
    if ($btnCreateCustom) {
      $btnCreateCustom.addEventListener('click', async () => {
        const nameInput = document.getElementById('custom-job-name');
        const iconSelect = document.getElementById('custom-job-icon');

        const name = nameInput?.value.trim();
        const icon = iconSelect?.value || 'fa-briefcase';

        if (!name) {
          await window.flowAlert({
            title: 'Name Required',
            message: 'Please enter a name for your custom job board.',
            icon: 'fa-circle-exclamation',
            type: 'warning',
            confirmText: 'OK'
          });
          return;
        }

        const safeId = 'job_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);

        const newBoard = {
          id: safeId,
          name: name,
          icon: icon,
          columns: [
            { id: 'deliverableUrl', label: 'Deliverable Link', type: 'url', icon: 'fa-link', visible: true }
          ]
        };

        const boards = userSettings.boards || [];
        boards.push(newBoard);
        userSettings.boards = boards;
        userSettings.activeBoardId = newBoard.id;

        if (nameInput) nameInput.value = '';

        await saveUserSettings(userSettings);
        renderManageJobsModal();
        renderAll();
      });
    }
  }

  // ==========================================
  // Task Tracker (CRUD & Table Rendering)
  // ==========================================

  function populateBoardSelect(selectId, selectedId = null) {
    const $sel = document.getElementById(selectId);
    if (!$sel) return;
    const boards = userSettings.boards || [];
    $sel.innerHTML = boards.map(b => `
      <option value="${b.id}" ${selectedId === b.id ? 'selected' : ''}>${escapeHtml(b.name)}</option>
    `).join('');
  }

  // Selected Job Board for Add Task Panel (user must choose a board first)
  let selectedAddTaskBoardId = null;

  function renderAddTaskPanel(preferredBoardId = null) {
    const boards = userSettings.boards || [];
    const $cardsContainer = document.getElementById('add-task-board-cards');
    const $hint = document.getElementById('add-task-board-status-hint');
    const $noBoardPrompt = document.getElementById('add-task-no-board-prompt');
    const $formWrapper = document.getElementById('add-task-form-wrapper');
    const $boardIdInput = document.getElementById('proj-board-id');
    const $boardSelect = document.getElementById('proj-board-select');

    if (!$cardsContainer) return;

    if (preferredBoardId && boards.some(b => b.id === preferredBoardId)) {
      selectedAddTaskBoardId = preferredBoardId;
    }

    if (boards.length === 0) {
      selectedAddTaskBoardId = null;
      $cardsContainer.innerHTML = `
        <div class="col-span-full flow-card p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-lg">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <h3 class="text-sm font-heading font-bold text-white">No Active Job Boards</h3>
            <p class="text-xs text-slate-400 mt-1">Add a job board to your account before creating tasks.</p>
          </div>
          <button type="button" onclick="window.flowOpenManageJobs()" class="btn-flow-primary px-4 py-2 rounded-xl text-white font-bold text-xs cursor-pointer shadow-md inline-flex items-center gap-1.5">
            <i class="fa-solid fa-plus"></i>
            <span>Choose Job Boards</span>
          </button>
        </div>
      `;
      if ($hint) $hint.textContent = '0 active boards';
      if ($noBoardPrompt) $noBoardPrompt.classList.add('hidden');
      if ($formWrapper) $formWrapper.classList.add('hidden');
      return;
    }

    // Populate sync board select
    if ($boardSelect) {
      $boardSelect.innerHTML = boards.map(b => `<option value="${b.id}">${escapeHtml(b.name)}</option>`).join('');
    }

    // Render cards strictly for ONLY the freelancer's active boards
    $cardsContainer.innerHTML = boards.map(b => {
      const isSelected = selectedAddTaskBoardId === b.id;
      const customColCount = (b.columns || []).filter(c => c.visible !== false).length;
      return `
        <button 
          type="button" 
          onclick="window.flowSelectAddTaskBoard('${b.id}')"
          class="add-task-board-card group p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
            isSelected 
              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400' 
              : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-slate-300'
          }"
        >
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'} flex items-center justify-center text-xs transition-colors">
              <i class="fa-solid ${b.icon || 'fa-briefcase'}"></i>
            </div>
            ${isSelected ? '<span class="text-cyan-400 text-xs"><i class="fa-solid fa-circle-check"></i></span>' : '<span class="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors"></span>'}
          </div>
          <div>
            <div class="text-xs font-heading font-bold ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'} truncate">${escapeHtml(b.name)}</div>
            <div class="text-[10px] font-mono text-slate-400">${customColCount} custom field${customColCount === 1 ? '' : 's'}</div>
          </div>
        </button>
      `;
    }).join('');

    if (selectedAddTaskBoardId && boards.some(b => b.id === selectedAddTaskBoardId)) {
      const activeB = boards.find(b => b.id === selectedAddTaskBoardId);
      if ($hint) $hint.textContent = `Selected: ${activeB.name}`;
      if ($boardIdInput) $boardIdInput.value = selectedAddTaskBoardId;
      if ($boardSelect) $boardSelect.value = selectedAddTaskBoardId;

      const $icon = document.getElementById('add-task-active-icon');
      const $name = document.getElementById('add-task-active-board-name');
      if ($icon) $icon.className = `fa-solid ${activeB.icon || 'fa-briefcase'}`;
      if ($name) $name.textContent = `${activeB.name} Deliverable`;

      if ($noBoardPrompt) $noBoardPrompt.classList.add('hidden');
      if ($formWrapper) $formWrapper.classList.remove('hidden');
      renderCustomFieldInputs('proj-custom-fields-container', {}, selectedAddTaskBoardId);
    } else {
      if ($hint) $hint.textContent = 'Pick a board to show form';
      if ($noBoardPrompt) $noBoardPrompt.classList.remove('hidden');
      if ($formWrapper) $formWrapper.classList.add('hidden');
      const customContainer = document.getElementById('proj-custom-fields-container');
      if (customContainer) customContainer.innerHTML = '';
    }
  }

  window.flowSelectAddTaskBoard = function (boardId) {
    selectedAddTaskBoardId = boardId;
    renderAddTaskPanel(boardId);
    const $title = document.getElementById('proj-title');
    if ($title) setTimeout(() => $title.focus(), 100);
  };

  function initProjectManagement() {
    // Add new task form
    const $newProjForm = document.getElementById('new-project-form');
    if ($newProjForm) {
      $newProjForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const boards = userSettings.boards || [];
        const boardId = selectedAddTaskBoardId || (boards[0] ? boards[0].id : 'video_editor');
        const board = boards.find(b => b.id === boardId);
        const boardName = board ? board.name : 'Freelance';

        const title = document.getElementById('proj-title').value.trim();
        const clientName = document.getElementById('proj-client-name').value.trim() || 'Client';
        const price = parseFloat(document.getElementById('proj-budget').value) || 0;
        const dueDate = document.getElementById('proj-due-date')?.value || '';
        const status = document.getElementById('proj-status')?.value || 'In Progress';
        const payment = document.getElementById('proj-payment')?.value || 'Unpaid';

        const customFields = getCustomFieldValues('proj-custom-fields-container');
        const rawUrl = customFields.rawFilesUrl || '';
        const finalUrl = customFields.youtubeLink || '';

        const isPaid = payment === 'Paid';
        const paidAmount = isPaid ? price : 0;
        const paymentStatus = isPaid ? 'Paid' : 'Unpaid';

        await createProjectApi({
          boardId,
          title,
          clientName,
          service: boardName,
          price,
          budget: price,
          paidAmount,
          paymentStatus,
          status,
          dueDate,
          rawFilesUrl: rawUrl,
          youtubeLink: finalUrl,
          customFields
        });

        $newProjForm.reset();
        selectedAddTaskBoardId = null;
        userSettings.activeBoardId = boardId;
        await saveUserSettings(userSettings);
        renderAll();
        switchTab('panel-projects');
      });
    }

    // Dynamic field update when board dropdown changes in Edit Task modal
    const $modalBoardSelect = document.getElementById('modal-proj-board-select');
    if ($modalBoardSelect) {
      $modalBoardSelect.addEventListener('change', (e) => {
        const editId = document.getElementById('edit-video-id')?.value;
        const p = cachedProjects.find(item => item.id === editId);
        const combined = p ? { ...(p.customFields || {}) } : {};
        renderCustomFieldInputs('modal-custom-fields-container', combined, e.target.value);
      });
    }

    // Status filter
    const $statusFilter = document.getElementById('project-status-filter');
    if ($statusFilter) {
      $statusFilter.addEventListener('change', renderSheetTable);
    }

    // Search input
    const $searchInput = document.getElementById('project-search-input');
    if ($searchInput) {
      $searchInput.addEventListener('input', debounce((e) => {
        projectSearchQuery = e.target.value.toLowerCase().trim();
        renderSheetTable();
      }, 100));
    }

    // Add task button
    const $btnOpenAddVideo = document.getElementById('btn-open-add-video');
    if ($btnOpenAddVideo) {
      $btnOpenAddVideo.addEventListener('click', () => {
        window.flowOpenAddVideo();
      });
    }

    // Modal close buttons
    const $videoModal = document.getElementById('video-modal-dialog');
    const $btnCloseModal = document.getElementById('btn-close-video-modal');
    const $btnCancelModal = document.getElementById('btn-cancel-video-modal');

    if ($btnCloseModal) $btnCloseModal.addEventListener('click', window.flowCloseVideoModal);
    if ($btnCancelModal) $btnCancelModal.addEventListener('click', window.flowCloseVideoModal);
    if ($videoModal) {
      $videoModal.addEventListener('click', (e) => {
        if (e.target === $videoModal) window.flowCloseVideoModal();
      });
    }

    // Task edit modal form submit
    const $videoForm = document.getElementById('video-editor-form');
    if ($videoForm) {
      $videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('edit-video-id')?.value;
        const boardSelect = document.getElementById('modal-proj-board-select');
        const boardId = boardSelect ? boardSelect.value : (userSettings.boards[0]?.id || 'video_editor');
        const board = (userSettings.boards || []).find(b => b.id === boardId);
        const boardName = board ? board.name : 'Freelance';
        const title = document.getElementById('input-video-title').value.trim();
        const client = document.getElementById('input-video-client').value.trim() || 'Client';
        const status = document.getElementById('input-video-status').value || 'Not Started';
        const price = parseFloat(document.getElementById('input-video-price').value) || 0;
        const dueDate = document.getElementById('input-video-due-date')?.value || '';
        const paymentVal = document.getElementById('input-video-payment').value;

        const customFields = getCustomFieldValues('modal-custom-fields-container');
        const isPaid = paymentVal === 'Paid';
        const paidAmount = isPaid ? price : 0;
        const paymentStatus = isPaid ? 'Paid' : 'Unpaid';

        if (editId) {
          await updateProjectApi(editId, {
            boardId,
            title,
            clientName: client,
            service: boardName,
            status,
            budget: price,
            price,
            paidAmount,
            paymentStatus,
            dueDate,
            customFields
          });
        }
        window.flowCloseVideoModal();
      });
    }
  }

  // Open Edit Task Modal
  window.flowOpenEditVideo = function (id) {
    const p = cachedProjects.find(item => item.id === id);
    if (!p) return;

    const $modal = document.getElementById('video-modal-dialog');
    const $idInput = document.getElementById('edit-video-id');
    const $titleInput = document.getElementById('input-video-title');
    const $clientInput = document.getElementById('input-video-client');
    const $statusInput = document.getElementById('input-video-status');
    const $priceInput = document.getElementById('input-video-price');
    const $dueInput = document.getElementById('input-video-due-date');
    const $paymentInput = document.getElementById('input-video-payment');
    const $heading = document.getElementById('modal-video-heading');

    if ($idInput) $idInput.value = p.id;
    if ($titleInput) $titleInput.value = p.title || '';
    if ($clientInput) $clientInput.value = p.clientName || '';
    if ($statusInput) $statusInput.value = p.status || 'Not Started';
    if ($priceInput) $priceInput.value = p.budget || p.price || 0;
    if ($dueInput) $dueInput.value = p.dueDate || '';
    if ($paymentInput) $paymentInput.value = isPaidStatus(p.paymentStatus) ? 'Paid' : 'Unpaid';
    if ($heading) $heading.textContent = 'Edit Task';

    const taskBoardId = p.boardId || (userSettings.boards[0]?.id || 'video_editor');
    populateBoardSelect('modal-proj-board-select', taskBoardId);

    // Populate dynamic custom field inputs
    const combinedCustom = { ...(p.customFields || {}) };
    if (p.rawFilesUrl && !combinedCustom.rawFilesUrl) combinedCustom.rawFilesUrl = p.rawFilesUrl;
    if (p.youtubeLink && !combinedCustom.youtubeLink) combinedCustom.youtubeLink = p.youtubeLink;

    renderCustomFieldInputs('modal-custom-fields-container', combinedCustom, taskBoardId);

    if ($modal) $modal.classList.remove('hidden');
  };

  window.flowCloseVideoModal = function () {
    const $modal = document.getElementById('video-modal-dialog');
    if ($modal) $modal.classList.add('hidden');
  };

  window.flowOpenAddVideo = function (prefilledDate = '', preferredBoardId = null) {
    const boards = userSettings.boards || [];
    if (boards.length === 0) {
      window.flowAlert({
        title: 'No Job Boards',
        message: 'Please add at least one Job Board before creating tasks.',
        icon: 'fa-layer-group',
        type: 'info',
        confirmText: 'Add Board'
      }).then(() => {
        window.flowOpenManageJobs();
      });
      return;
    }
    switchTab('panel-new-proj');
    const defaultBoard = preferredBoardId || (userSettings.activeBoardId !== 'all' ? userSettings.activeBoardId : (boards[0]?.id || ''));
    window.flowSelectAddTaskBoard(defaultBoard);
    const $due = document.getElementById('proj-due-date');
    if ($due) {
      $due.value = prefilledDate || '';
    }
    const $title = document.getElementById('proj-title');
    if ($title) setTimeout(() => $title.focus(), 150);
  };

  // Toggle Payment (Paid / Unpaid)
  window.flowTogglePayment = async function (id) {
    const p = cachedProjects.find(item => item.id === id);
    if (!p) return;

    const price = p.budget || p.price || 0;
    const isPaid = isPaidStatus(p.paymentStatus);
    const newPaymentStatus = isPaid ? 'Unpaid' : 'Paid';
    const newPaidAmount = isPaid ? 0 : price;

    p.paymentStatus = newPaymentStatus;
    p.paidAmount = newPaidAmount;

    renderSheetTable();
    renderRevenueOverview();
    renderCalendar();
    checkDeadlineAlerts();

    await patchProjectApi(id, { paymentStatus: newPaymentStatus, paidAmount: newPaidAmount });
  };

  // Cycle status: Not Started -> In Progress -> Published/Completed
  window.flowCycleStatus = async function (id) {
    const p = cachedProjects.find(item => item.id === id);
    if (!p) return;

    let nextStatus = 'In Progress';
    if (!p.status || p.status === 'Not Started' || p.status === "Haven't Started") {
      nextStatus = 'In Progress';
    } else if (p.status === 'In Progress') {
      nextStatus = 'Published';
    } else {
      nextStatus = 'Not Started';
    }

    p.status = nextStatus;
    renderSheetTable();
    renderRevenueOverview();
    renderCalendar();
    checkDeadlineAlerts();

    await patchProjectApi(id, { status: nextStatus });
  };

  // Delete project
  window.flowDeleteProject = async function (id) {
    const confirmed = await window.flowConfirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task from your tracker?',
      icon: 'fa-trash-can',
      type: 'danger',
      confirmText: 'Delete Task'
    });
    if (confirmed) {
      await deleteProjectApi(id);
    }
  };

  // Status Badge Helper
  function getStatusBadge(status, id) {
    const st = status || 'Not Started';
    let colorClass = 'bg-slate-800 text-slate-400 border-slate-700';
    let icon = 'fa-clock';
    let label = 'Not Started';

    if (st === 'Published' || st === 'Completed') {
      colorClass = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      icon = 'fa-circle-check';
      label = 'Delivered';
    } else if (st === 'In Progress') {
      colorClass = 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      icon = 'fa-spinner fa-spin-pulse';
      label = 'In Progress';
    }

    return `
      <button 
        type="button" 
        onclick="window.flowCycleStatus('${id}')" 
        class="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90 ${colorClass}" 
        title="Click to cycle status"
      >
        <i class="fa-solid ${icon} text-[11px]"></i>
        <span>${label}</span>
      </button>
    `;
  }

  // Render the Task Tracker table
  function renderSheetTable() {
    const $container = document.getElementById('sheet-table-container');
    if (!$container) return;

    const boards = userSettings.boards || [];
    const activeBoard = getActiveBoard();
    const isMasterView = userSettings.activeBoardId === 'all';
    
    // Show onboarding card if no boards exist yet
    if (boards.length === 0 || !activeBoard) {
      const $projCount = document.getElementById('project-total-count');
      const $projPaid = document.getElementById('project-paid-amount');
      const $projUnpaid = document.getElementById('project-unpaid-amount');

      if ($projCount) $projCount.textContent = `0 Tasks`;
      if ($projPaid) $projPaid.textContent = formatMoney(0);
      if ($projUnpaid) $projUnpaid.textContent = formatMoney(0);

      $container.innerHTML = `
        <div class="flow-card p-10 sm:p-14 rounded-2xl border border-cyan-500/25 text-center space-y-4 max-w-lg mx-auto my-8">
          <div class="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-cyan-500/10">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <h3 class="text-xl font-heading font-bold text-white">No Job Boards Added Yet</h3>
            <p class="text-xs text-slate-400 mt-1">Get started by choosing the type of freelance work you do, or create a custom board.</p>
          </div>
          <div class="pt-2">
            <button onclick="window.flowOpenManageJobs()" class="btn-flow-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20">
              <i class="fa-solid fa-plus mr-1.5"></i> Choose Your Job Boards
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Filter projects exclusively for the active job board (or all in master view)
    const boardProjects = isMasterView
      ? cachedProjects
      : cachedProjects.filter(p => (p.boardId || (boards[0]?.id || '')) === userSettings.activeBoardId);

    // Show empty state card if no tasks exist for this board
    if (boardProjects.length === 0) {
      const $projCount = document.getElementById('project-total-count');
      const $projPaid = document.getElementById('project-paid-amount');
      const $projUnpaid = document.getElementById('project-unpaid-amount');

      if ($projCount) $projCount.textContent = `0 Tasks`;
      if ($projPaid) $projPaid.textContent = formatMoney(0);
      if ($projUnpaid) $projUnpaid.textContent = formatMoney(0);

      $container.innerHTML = `
        <div class="flow-card p-10 sm:p-14 rounded-2xl border border-cyan-500/25 text-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto text-xl shadow-lg shadow-cyan-500/10">
            <i class="fa-solid ${activeBoard.icon || 'fa-list-check'}"></i>
          </div>
          <h3 class="text-lg font-heading font-bold text-white">No ${escapeHtml(activeBoard.name)} Tasks Logged Yet</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Start tracking deliverables, rates, deadlines, and project links for this job.</p>
          <div class="pt-2">
            <button onclick="window.flowOpenAddVideo()" class="btn-flow-primary px-4 py-2 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer">
              <i class="fa-solid fa-plus mr-1.5"></i> Add First ${escapeHtml(activeBoard.name)} Task
            </button>
          </div>
        </div>
      `;
      return;
    }

    let allProjectsPaid = 0;
    let allProjectsUnpaid = 0;
    const filtered = [];
    const nowZero = new Date().setHours(0, 0, 0, 0);

    for (let i = 0; i < boardProjects.length; i++) {
      const p = boardProjects[i];
      const price = p.budget || p.price || 0;
      const isPaid = isPaidStatus(p.paymentStatus);
      if (isPaid) {
        allProjectsPaid += price;
      } else {
        allProjectsUnpaid += price;
      }

      // 1. Search Query Filter (strictly Title and Status, including 'delivered')
      if (projectSearchQuery) {
        const rawStatus = p.status || 'Not Started';
        const isDelivered = rawStatus === 'Published' || rawStatus === 'Completed';
        const statusAlias = isDelivered ? 'delivered published completed' : rawStatus;
        const searchStr = `${p.title || ''} ${statusAlias}`.toLowerCase();
        if (!searchStr.includes(projectSearchQuery)) continue;
      }

      // 2. Column Filter: Status
      const statusFilter = columnFilters.status;
      if (statusFilter && statusFilter !== 'default' && statusFilter !== 'All') {
        const st = p.status || 'Not Started';
        if (statusFilter === 'Published' || statusFilter === 'Completed') {
          if (st !== 'Published' && st !== 'Completed') continue;
        } else if (st !== statusFilter) {
          continue;
        }
      }

      // 3. Column Filter: Payment
      const paymentFilter = columnFilters.payment;
      if (paymentFilter && paymentFilter !== 'default' && paymentFilter !== 'All') {
        if (paymentFilter === 'Paid' && !isPaid) continue;
        if (paymentFilter === 'Unpaid' && isPaid) continue;
      }

      // 4. Column Filter: Price
      const priceFilter = columnFilters.price;
      if (priceFilter === 'priced' && price <= 0) continue;
      if (priceFilter === 'free' && price > 0) continue;

      // 5. Column Filter: Due Date
      const dueDateFilter = columnFilters.dueDate;
      if (dueDateFilter && dueDateFilter !== 'default') {
        if (dueDateFilter === 'undated') {
          if (p.dueDate) continue;
        } else if (!p.dueDate) {
          continue;
        } else {
          const taskDate = new Date(p.dueDate).setHours(0, 0, 0, 0);
          const diffDays = Math.round((taskDate - nowZero) / (1000 * 60 * 60 * 24));
          const isDone = p.status === 'Published' || p.status === 'Completed';

          if (dueDateFilter === 'overdue') {
            if (isDone || diffDays >= 0) continue;
          } else if (dueDateFilter === 'today') {
            if (diffDays !== 0) continue;
          } else if (dueDateFilter === 'tomorrow') {
            if (diffDays !== 1) continue;
          } else if (dueDateFilter === 'upcoming') {
            if (diffDays < 0 || diffDays > 7) continue;
          }
        }
      }

      // 6. Column Filter: Job Board (in Master view)
      const boardFilter = columnFilters.board;
      if (boardFilter && boardFilter !== 'default') {
        if ((p.boardId || 'video_editor') !== boardFilter) continue;
      }

      // 7. Column Filter: Custom Columns
      let customFilteredOut = false;
      const visibleCols = isMasterView 
        ? [] 
        : (activeBoard.columns || []).filter(c => c.visible !== false);

      for (const col of visibleCols) {
        const cFilter = columnFilters[col.id];
        if (!cFilter || cFilter === 'default') continue;

        const cf = p.customFields || {};
        let val = cf[col.id];
        if (val === undefined || val === null || val === '') {
          if (col.id === 'rawFilesUrl') val = p.rawFilesUrl;
          if (col.id === 'youtubeLink') val = p.youtubeLink;
        }
        val = val !== undefined && val !== null ? String(val).trim() : '';

        if (col.type === 'url') {
          const hasLink = val.startsWith('http://') || val.startsWith('https://');
          if (cFilter === 'has_link' && !hasLink) { customFilteredOut = true; break; }
          if (cFilter === 'no_link' && hasLink) { customFilteredOut = true; break; }
        } else if (col.type === 'number') {
          const num = parseFloat(val) || 0;
          if (cFilter === 'positive' && num <= 0) { customFilteredOut = true; break; }
          if (cFilter === 'empty' && num > 0) { customFilteredOut = true; break; }
        } else if (col.type === 'date') {
          if (cFilter === 'has_date' && !val) { customFilteredOut = true; break; }
          if (cFilter === 'empty' && val) { customFilteredOut = true; break; }
        } else {
          // text column
          if (cFilter === 'filled' && !val) { customFilteredOut = true; break; }
          if (cFilter === 'empty' && val) { customFilteredOut = true; break; }
          if (cFilter.startsWith('val_')) {
            const targetVal = cFilter.replace('val_', '');
            if (val.toLowerCase() !== targetVal.toLowerCase()) { customFilteredOut = true; break; }
          }
        }
      }
      if (customFilteredOut) continue;

      filtered.push(p);
    }

    // Active filters / sort summary badge in toolbar
    const $filterIndicator = document.getElementById('project-filter-indicator');
    if ($filterIndicator) {
      const activePills = [];
      if (activeTableSort.column) {
        let colName = activeTableSort.column;
        if (colName === 'dueDate') colName = 'Due Date';
        else if (colName === 'title') colName = 'Title';
        else if (colName === 'price') colName = 'Price';
        else if (colName === 'status') colName = 'Status';
        else if (colName === 'payment') colName = 'Payment';
        else if (colName === 'board') colName = 'Job Board';
        else {
          const colDef = (activeBoard.columns || []).find(c => c.id === colName);
          if (colDef) colName = colDef.label;
        }
        const dir = activeTableSort.direction === 'asc' ? '▲' : '▼';
        activePills.push(`Sort: ${escapeHtml(colName)} ${dir}`);
      }

      for (const [k, v] of Object.entries(columnFilters)) {
        if (!v || v === 'default') continue;
        let label = k;
        if (k === 'status') label = `Status: ${v}`;
        else if (k === 'payment') label = `Payment: ${v}`;
        else if (k === 'dueDate') label = `Due: ${v}`;
        else if (k === 'board') {
          const b = (userSettings.boards || []).find(bd => bd.id === v);
          label = `Board: ${b ? b.name : v}`;
        } else {
          const colDef = (activeBoard.columns || []).find(c => c.id === k);
          label = `${colDef ? colDef.label : k}: ${v.replace('val_', '')}`;
        }
        activePills.push(escapeHtml(label));
      }

      if (activePills.length > 0) {
        $filterIndicator.className = 'flex items-center';
        $filterIndicator.innerHTML = `
          <div class="px-2.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-sm shadow-cyan-500/10">
            <i class="fa-solid fa-filter text-[10px] text-cyan-400"></i>
            <span>${activePills.join(' &bull; ')}</span>
            <button 
              type="button" 
              onclick="window.flowResetAllFiltersAndSorts()" 
              class="w-4 h-4 rounded-full bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 flex items-center justify-center text-[10px] transition-colors cursor-pointer ml-1"
              title="Clear all active column filters and sorts"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
      } else {
        $filterIndicator.className = 'hidden';
        $filterIndicator.innerHTML = '';
      }
    }

    // Apply column sorting if active
    if (activeTableSort.column) {
      const colKey = activeTableSort.column;
      const dir = activeTableSort.direction;

      filtered.sort((a, b) => {
        let valA, valB;
        let isDate = false;
        let isNum = false;

        if (colKey === 'index') {
          const idxA = boardProjects.indexOf(a);
          const idxB = boardProjects.indexOf(b);
          return dir === 'asc' ? idxA - idxB : idxB - idxA;
        }

        if (colKey === 'title') {
          valA = (a.title || '').toLowerCase();
          valB = (b.title || '').toLowerCase();
        } else if (colKey === 'board') {
          valA = (a.boardId || '').toLowerCase();
          valB = (b.boardId || '').toLowerCase();
        } else if (colKey === 'status') {
          const statusRank = (st) => {
            if (st === 'Published' || st === 'Completed') return 3;
            if (st === 'In Progress') return 2;
            return 1;
          };
          valA = statusRank(a.status);
          valB = statusRank(b.status);
          isNum = true;
        } else if (colKey === 'payment') {
          valA = isPaidStatus(a.paymentStatus) ? 2 : 1;
          valB = isPaidStatus(b.paymentStatus) ? 2 : 1;
          isNum = true;
        } else if (colKey === 'price') {
          valA = parseFloat(a.budget || a.price || 0);
          valB = parseFloat(b.budget || b.price || 0);
          isNum = true;
        } else if (colKey === 'dueDate') {
          valA = a.dueDate || '';
          valB = b.dueDate || '';
          isDate = true;
        } else {
          // Custom column
          const colDef = (activeBoard.columns || []).find(c => c.id === colKey);
          const cfA = a.customFields || {};
          const cfB = b.customFields || {};
          valA = cfA[colKey] !== undefined ? cfA[colKey] : (a[colKey] || '');
          valB = cfB[colKey] !== undefined ? cfB[colKey] : (b[colKey] || '');

          if (colDef && colDef.type === 'number') {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
            isNum = true;
          } else if (colDef && colDef.type === 'date') {
            isDate = true;
          } else if (colDef && colDef.type === 'url') {
            valA = (String(valA).startsWith('http://') || String(valA).startsWith('https://')) ? 2 : 1;
            valB = (String(valB).startsWith('http://') || String(valB).startsWith('https://')) ? 2 : 1;
            isNum = true;
          } else {
            valA = String(valA || '').toLowerCase();
            valB = String(valB || '').toLowerCase();
          }
        }

        // Special handling for empty dates (always push empty dates to bottom)
        if (isDate) {
          if (!valA && !valB) return 0;
          if (!valA) return 1;
          if (!valB) return -1;
          const timeA = new Date(valA).getTime();
          const timeB = new Date(valB).getTime();
          return dir === 'asc' ? timeA - timeB : timeB - timeA;
        }

        // Number comparison
        if (isNum) {
          return dir === 'asc' ? valA - valB : valB - valA;
        }

        // String comparison
        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const $projCount = document.getElementById('project-total-count');
    const $projPaid = document.getElementById('project-paid-amount');
    const $projUnpaid = document.getElementById('project-unpaid-amount');

    if ($projCount) $projCount.textContent = `${boardProjects.length} Tasks`;
    if ($projPaid) $projPaid.textContent = formatMoney(allProjectsPaid);
    if ($projUnpaid) $projUnpaid.textContent = formatMoney(allProjectsUnpaid);

    let totalTablePrice = 0;
    let totalTablePaid = 0;
    let totalTableUnpaid = 0;

    const visibleCols = isMasterView 
      ? [] 
      : (activeBoard.columns || []).filter(c => c.visible !== false);
    const totalColSpan = (isMasterView ? 6 : 5) + visibleCols.length + 1; // Title + [Board] + Status + Payment + Price + Due Date + CustomCols + Actions

    const rowsHtml = filtered.length > 0
      ? filtered.map((p, idx) => {
          const isPaid = isPaidStatus(p.paymentStatus);
          const price = p.budget || p.price || 0;
          const paid = isPaid ? price : 0;
          totalTablePrice += price;
          totalTablePaid += paid;
          totalTableUnpaid += isPaid ? 0 : price;

          // Due date badge formatting
          let dueDateHtml = `<span class="text-slate-600 text-xs font-mono italic">—</span>`;
          if (p.dueDate) {
            const isCompleted = p.status === 'Published' || p.status === 'Completed';
            const diffDays = Math.round((new Date(p.dueDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
            if (!isCompleted && diffDays < 0) {
              dueDateHtml = `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold inline-flex items-center gap-1" title="Overdue by ${Math.abs(diffDays)} days!"><i class="fa-solid fa-triangle-exclamation text-rose-400"></i> ${p.dueDate}</span>`;
            } else if (!isCompleted && diffDays === 0) {
              dueDateHtml = `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/90 text-amber-300 border border-amber-500/40 font-bold inline-flex items-center gap-1" title="Due Today!"><i class="fa-solid fa-bell text-amber-400"></i> Today</span>`;
            } else if (!isCompleted && diffDays === 1) {
              dueDateHtml = `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold inline-flex items-center gap-1" title="Due Tomorrow!"><i class="fa-solid fa-clock text-amber-400"></i> Tomorrow</span>`;
            } else {
              dueDateHtml = `<span class="text-slate-300 text-xs font-mono">${p.dueDate}</span>`;
            }
          }

          // Optional board badge in master overview
          const b = (userSettings.boards || []).find(bd => bd.id === (p.boardId || 'video_editor'));
          const boardCellHtml = isMasterView ? `
            <td class="px-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1.5 font-semibold">
                <i class="fa-solid ${b ? b.icon : 'fa-briefcase'} text-[10px]"></i>
                <span>${escapeHtml(b ? b.name : (p.boardId || 'Task'))}</span>
              </span>
            </td>
          ` : '';

          // Render custom column values
          const customCellsHtml = visibleCols.map(col => {
            const cf = p.customFields || {};
            let val = cf[col.id];
            if (val === undefined || val === null || val === '') {
              // Backward compat fallbacks
              if (col.id === 'rawFilesUrl') val = p.rawFilesUrl;
              if (col.id === 'youtubeLink') val = p.youtubeLink;
            }

            if (!val) {
              return `<td class="text-center px-3"><span class="text-slate-600 text-xs font-mono italic">—</span></td>`;
            }

            if (col.type === 'url') {
              const isUrl = String(val).startsWith('http://') || String(val).startsWith('https://');
              if (isUrl) {
                return `
                  <td class="text-center px-3">
                    <a href="${escapeHtml(val)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-mono transition-colors group" title="${escapeHtml(val)}">
                      <i class="fa-solid ${col.icon || 'fa-link'} text-cyan-400 group-hover:scale-110 transition-transform"></i>
                      <span>Open</span>
                      <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
                    </a>
                  </td>
                `;
              }
              return `<td class="text-center px-3 font-mono text-xs text-slate-300">${escapeHtml(val)}</td>`;
            }

            if (col.type === 'number') {
              return `<td class="text-center px-3 font-mono text-xs text-slate-200 font-semibold">${escapeHtml(val)}</td>`;
            }

            return `<td class="text-center px-3 font-mono text-xs text-slate-300">${escapeHtml(val)}</td>`;
          }).join('');

          return `
            <tr class="${!isPaid ? 'row-unpaid' : ''}">
              <td>
                <div class="flex flex-col">
                  <span class="font-bold text-white text-sm hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2" onclick="window.flowOpenEditVideo('${p.id}')" title="Click to edit task details">
                    ${escapeHtml(p.title)}
                  </span>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>client: <strong class="text-slate-300 font-medium">${escapeHtml(p.clientName || 'Client')}</strong></span>
                  </div>
                </div>
              </td>
              ${boardCellHtml}
              <td>
                ${getStatusBadge(p.status, p.id)}
              </td>
              <td>
                <button 
                  type="button" 
                  onclick="window.flowTogglePayment('${p.id}')" 
                  class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                    isPaid 
                      ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                  }"
                  title="Click to toggle Paid / Unpaid"
                >
                  <i class="fa-solid ${isPaid ? 'fa-circle-check text-emerald-400' : 'fa-hourglass-half text-amber-400'}"></i>
                  <span>${isPaid ? 'Paid' : 'Unpaid'}</span>
                </button>
              </td>
              <td class="font-mono text-slate-200 font-semibold text-right">
                ${formatMoney(price)}
              </td>
              <td class="text-center px-3">
                ${dueDateHtml}
              </td>
              ${customCellsHtml}
              <td>
                <div class="flex items-center gap-1.5 justify-end">
                  <button 
                    onclick="window.flowOpenEditVideo('${p.id}')" 
                    class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 text-xs transition-colors cursor-pointer"
                    title="Edit task"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onclick="window.flowDeleteProject('${p.id}')" 
                    class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="${totalColSpan}" class="p-8 text-center text-slate-500 italic">No tasks match the current search or filter criteria.</td></tr>`;

    const fullBodyHtml = rowsHtml + `<tr class="sheet-table-spacer"><td colspan="${totalColSpan}"></td></tr>`;

    const footHtml = `
      <tr>
        <td colspan="${isMasterView ? 4 : 3}" class="text-slate-300">
          <div class="flex items-center gap-3">
            <span class="text-cyan-400 font-bold">${filtered.length} Tasks Tracked</span>
            <span class="text-slate-600">&bull;</span>
            <span class="text-xs text-slate-400 font-normal">${escapeHtml(activeBoard.name)}</span>
          </div>
        </td>
        <td class="text-right text-white font-mono font-black">
          ${formatMoney(totalTablePrice)}
        </td>
        <td colspan="${visibleCols.length + 2}" class="text-right">
          <div class="inline-flex items-center gap-3">
            <span class="text-xs text-emerald-400 font-mono font-bold">Paid: ${formatMoney(totalTablePaid)}</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold">
              <i class="fa-solid fa-hourglass-half"></i>
              <span>Unpaid: ${formatMoney(totalTableUnpaid)}</span>
            </span>
          </div>
        </td>
      </tr>
    `;

    // Dynamic thead columns with customized dropdowns for each custom column
    const dynamicHeadersHtml = visibleCols.map(col => {
      return renderColumnHeader(col.id, col.label, 'center', 'px-3', col, boardProjects);
    }).join('');

    $container.innerHTML = `
      <div class="sheet-table-wrapper flow-scrollbar flex-1 min-h-0 overflow-auto">
        <table class="sheet-table">
          <thead>
            <tr>
              ${renderColumnHeader('title', 'Task Title', 'left', 'min-w-[180px]')}
              ${isMasterView ? renderColumnHeader('board', 'Job Board', 'left', 'px-3 min-w-[130px]') : ''}
              ${renderColumnHeader('status', 'Status', 'left', 'min-w-[110px]')}
              ${renderColumnHeader('payment', 'Payment', 'left', 'min-w-[105px]')}
              ${renderColumnHeader('price', 'Price', 'right', 'min-w-[100px]')}
              ${renderColumnHeader('dueDate', 'Due Date', 'center', 'px-3 min-w-[120px]')}
              ${dynamicHeadersHtml}
              <th class="text-right px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Quick Actions</th>
            </tr>
          </thead>
          <tbody id="sheet-table-tbody">
            ${fullBodyHtml}
          </tbody>
          <tfoot id="sheet-table-tfoot">
            ${footHtml}
          </tfoot>
        </table>
      </div>
    `;
  }

  // ==========================================
  // Calendar & Deadlines Module
  // ==========================================

  function initCalendar() {
    const $prevBtn = document.getElementById('cal-prev-month-btn');
    const $nextBtn = document.getElementById('cal-next-month-btn');
    const $todayBtn = document.getElementById('cal-today-btn');
    const $btnAddEvent = document.getElementById('btn-open-add-event');

    if ($prevBtn) {
      $prevBtn.addEventListener('click', () => {
        calendarMonth--;
        if (calendarMonth < 0) {
          calendarMonth = 11;
          calendarYear--;
        }
        renderCalendar();
      });
    }

    if ($nextBtn) {
      $nextBtn.addEventListener('click', () => {
        calendarMonth++;
        if (calendarMonth > 11) {
          calendarMonth = 0;
          calendarYear++;
        }
        renderCalendar();
      });
    }

    if ($todayBtn) {
      $todayBtn.addEventListener('click', () => {
        const today = new Date();
        calendarYear = today.getFullYear();
        calendarMonth = today.getMonth();
        renderCalendar();
      });
    }

    // Add Event Modal
    const $eventModal = document.getElementById('calendar-event-modal');
    const $btnCloseEvent = document.getElementById('btn-close-event-modal');
    const $btnCancelEvent = document.getElementById('btn-cancel-event-modal');
    const $eventForm = document.getElementById('calendar-event-form');
    const $btnDeleteEvent = document.getElementById('btn-delete-event');

    function openEventModal(initialDate = '') {
      if ($eventForm) $eventForm.reset();
      const $id = document.getElementById('edit-event-id');
      const $heading = document.getElementById('modal-event-heading');
      const $dateInput = document.getElementById('input-event-date');

      if ($id) $id.value = '';
      if ($heading) $heading.textContent = 'Add Calendar Event';
      if ($btnDeleteEvent) $btnDeleteEvent.classList.add('hidden');
      if ($dateInput) $dateInput.value = initialDate || formatDateISO(new Date());

      if ($eventModal) $eventModal.classList.remove('hidden');
    }

    function closeEventModal() {
      if ($eventModal) $eventModal.classList.add('hidden');
    }

    if ($btnAddEvent) $btnAddEvent.addEventListener('click', () => openEventModal());
    if ($btnCloseEvent) $btnCloseEvent.addEventListener('click', closeEventModal);
    if ($btnCancelEvent) $btnCancelEvent.addEventListener('click', closeEventModal);
    if ($eventModal) {
      $eventModal.addEventListener('click', (e) => {
        if (e.target === $eventModal) closeEventModal();
      });
    }

    // Submit Event
    if ($eventForm) {
      $eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-event-id')?.value;
        const title = document.getElementById('input-event-title').value.trim();
        const eventDate = document.getElementById('input-event-date').value;
        const eventTime = document.getElementById('input-event-time').value.trim();
        const eventType = document.getElementById('input-event-type').value;
        const notes = document.getElementById('input-event-notes').value.trim();

        if (id) {
          await updateCalendarEventApi(id, { title, eventDate, eventTime, eventType, notes });
        } else {
          await createCalendarEventApi({ title, eventDate, eventTime, eventType, notes });
        }
        closeEventModal();
      });
    }

    // Delete Event
    if ($btnDeleteEvent) {
      $btnDeleteEvent.addEventListener('click', async () => {
        const id = document.getElementById('edit-event-id')?.value;
        if (id) {
          const confirmed = await window.flowConfirm({
            title: 'Delete Event',
            message: 'Are you sure you want to delete this calendar event?',
            icon: 'fa-trash-can',
            type: 'danger',
            confirmText: 'Delete Event'
          });
          if (confirmed) {
            await deleteCalendarEventApi(id);
            closeEventModal();
          }
        }
      });
    }

    // Day Details Modal
    const $dayModal = document.getElementById('calendar-day-modal');
    const $btnCloseDay = document.getElementById('btn-close-day-modal');
    const $btnDayClose = document.getElementById('btn-day-close');
    const $btnDayAddEvent = document.getElementById('btn-day-add-event');
    const $btnDayAddTask = document.getElementById('btn-day-add-task');

    function closeDayModal() {
      if ($dayModal) $dayModal.classList.add('hidden');
    }

    if ($btnCloseDay) $btnCloseDay.addEventListener('click', closeDayModal);
    if ($btnDayClose) $btnDayClose.addEventListener('click', closeDayModal);
    if ($dayModal) {
      $dayModal.addEventListener('click', (e) => {
        if (e.target === $dayModal) closeDayModal();
      });
    }

    if ($btnDayAddEvent) {
      $btnDayAddEvent.addEventListener('click', () => {
        const activeDate = $dayModal.getAttribute('data-active-date');
        closeDayModal();
        openEventModal(activeDate);
      });
    }

    if ($btnDayAddTask) {
      $btnDayAddTask.addEventListener('click', () => {
        const activeDate = $dayModal.getAttribute('data-active-date');
        closeDayModal();
        window.flowOpenAddVideo(activeDate);
      });
    }

    window.flowOpenDayDetails = function (dateStr) {
      const $modal = document.getElementById('calendar-day-modal');
      const $title = document.getElementById('cal-day-modal-title');
      const $subtitle = document.getElementById('cal-day-modal-subtitle');
      const $container = document.getElementById('cal-day-modal-items');

      if (!$modal || !$container) return;

      $modal.setAttribute('data-active-date', dateStr);

      const d = new Date(dateStr + 'T00:00:00');
      if ($title) {
        $title.textContent = d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Filter tasks due on this date
      const tasksOnDate = cachedProjects.filter(p => p.dueDate === dateStr);
      // Filter events on this date
      const eventsOnDate = cachedCalendarEvents.filter(e => e.eventDate === dateStr);

      if ($subtitle) {
        $subtitle.textContent = `${tasksOnDate.length} Tasks Due • ${eventsOnDate.length} Events Scheduled`;
      }

      if (tasksOnDate.length === 0 && eventsOnDate.length === 0) {
        $container.innerHTML = `
          <div class="text-center p-8 text-slate-500 italic text-xs">
            No tasks or events scheduled for this date.
          </div>
        `;
      } else {
        const tasksHtml = tasksOnDate.map(p => {
          const isPaid = isPaidStatus(p.paymentStatus);
          const isDone = p.status === 'Published' || p.status === 'Completed';
          const b = (userSettings.boards || []).find(board => board.id === (p.boardId || 'video_editor'));
          return `
            <div class="p-3 rounded-xl bg-slate-900 border ${isDone ? 'border-emerald-500/40' : 'border-cyan-500/30'} flex items-center justify-between gap-3 text-xs font-mono">
              <div>
                <div class="font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span class="w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-cyan-400'}"></span>
                  ${b ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1"><i class="fa-solid ${b.icon || 'fa-briefcase'}"></i> ${escapeHtml(b.name)}</span>` : ''}
                  <span>${escapeHtml(p.title)}</span>
                </div>
                <div class="text-slate-400 text-[11px] mt-0.5">
                  client: <span class="text-slate-200">${escapeHtml(p.clientName)}</span> • ${formatMoney(p.price || 0)}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isDone ? 'bg-emerald-950 text-emerald-300' : 'bg-cyan-950 text-cyan-300'}">
                  ${p.status || 'In Progress'}
                </span>
                <button onclick="window.flowOpenEditVideo('${p.id}'); document.getElementById('calendar-day-modal').classList.add('hidden');" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] cursor-pointer" title="Edit Task">
                  Edit
                </button>
              </div>
            </div>
          `;
        }).join('');

        const eventsHtml = eventsOnDate.map(e => {
          return `
            <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3 text-xs font-mono">
              <div>
                <div class="font-bold text-purple-200 flex items-center gap-1.5">
                  <i class="fa-solid fa-calendar-check text-purple-400"></i>
                  <span>${escapeHtml(e.title)}</span>
                </div>
                <div class="text-slate-400 text-[11px] mt-0.5">
                  ${e.eventTime ? `<span class="text-amber-300 font-bold">${e.eventTime}</span> • ` : ''}
                  <span class="capitalize">${escapeHtml(e.eventType)}</span>
                  ${e.notes ? ` • <span class="italic text-slate-400">${escapeHtml(e.notes)}</span>` : ''}
                </div>
              </div>
              <button onclick="window.flowOpenEditEvent('${e.id}'); document.getElementById('calendar-day-modal').classList.add('hidden');" class="px-2 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-300 text-[11px] cursor-pointer" title="Edit Event">
                Edit
              </button>
            </div>
          `;
        }).join('');

        $container.innerHTML = tasksHtml + eventsHtml;
      }

      $modal.classList.remove('hidden');
    };

    window.flowOpenEditEvent = function (id) {
      const ev = cachedCalendarEvents.find(e => e.id === id);
      if (!ev) return;

      const $modal = document.getElementById('calendar-event-modal');
      const $id = document.getElementById('edit-event-id');
      const $heading = document.getElementById('modal-event-heading');
      const $title = document.getElementById('input-event-title');
      const $date = document.getElementById('input-event-date');
      const $time = document.getElementById('input-event-time');
      const $type = document.getElementById('input-event-type');
      const $notes = document.getElementById('input-event-notes');
      const $btnDel = document.getElementById('btn-delete-event');

      if ($id) $id.value = ev.id;
      if ($heading) $heading.textContent = 'Edit Calendar Event';
      if ($title) $title.value = ev.title || '';
      if ($date) $date.value = ev.eventDate || '';
      if ($time) $time.value = ev.eventTime || '';
      if ($type) $type.value = ev.eventType || 'call';
      if ($notes) $notes.value = ev.notes || '';
      if ($btnDel) $btnDel.classList.remove('hidden');

      if ($modal) $modal.classList.remove('hidden');
    };
  }

  function renderCalendar() {
    const $monthDisplay = document.getElementById('cal-current-month-display');
    const $grid = document.getElementById('calendar-days-grid');
    const $deadlineCount = document.getElementById('cal-deadline-count');

    if (!$grid) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if ($monthDisplay) {
      $monthDisplay.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
    }

    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const todayStr = formatDateISO(new Date());

    let totalMonthDeadlines = 0;

    let cellsHtml = '';

    // Blank padding cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      cellsHtml += `<div class="bg-slate-900/20 border border-slate-800/40 rounded-xl p-2 min-h-[90px] opacity-30"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;

      // Filter tasks due on this date
      const tasksOnDay = cachedProjects.filter(p => p.dueDate === dateStr);
      // Filter events on this date
      const eventsOnDay = cachedCalendarEvents.filter(e => e.eventDate === dateStr);

      totalMonthDeadlines += tasksOnDay.length;

      const itemsToShow = [];

      tasksOnDay.forEach(p => {
        const isDone = p.status === 'Published' || p.status === 'Completed';
        const diffDays = Math.round((new Date(p.dueDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
        let badgeClass = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30';
        if (isDone) {
          badgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
        } else if (diffDays < 0) {
          badgeClass = 'bg-rose-950/90 text-rose-300 border-rose-500/40 font-bold';
        } else if (diffDays === 0 || diffDays === 1) {
          badgeClass = 'bg-amber-950/90 text-amber-300 border-amber-500/40 font-bold';
        }

        const b = (userSettings.boards || []).find(board => board.id === (p.boardId || 'video_editor'));
        const icon = b ? b.icon : 'fa-briefcase';

        itemsToShow.push(`
          <div class="px-1.5 py-0.5 rounded text-[10px] font-mono border truncate flex items-center gap-1 ${badgeClass}" title="[${escapeHtml(b ? b.name : 'Task')}] ${escapeHtml(p.title)} (${p.status})">
            <i class="fa-solid ${icon} text-[9px] flex-shrink-0"></i>
            <span class="truncate">${escapeHtml(p.title)}</span>
          </div>
        `);
      });

      eventsOnDay.forEach(e => {
        itemsToShow.push(`
          <div class="px-1.5 py-0.5 rounded text-[10px] font-mono border border-purple-500/40 bg-purple-950/80 text-purple-300 truncate" title="Event: ${escapeHtml(e.title)}">
            ★ ${escapeHtml(e.title)}
          </div>
        `);
      });

      const maxVisible = 2;
      const visibleItems = itemsToShow.slice(0, maxVisible);
      const remainingCount = itemsToShow.length - maxVisible;

      cellsHtml += `
        <div 
          onclick="window.flowOpenDayDetails('${dateStr}')" 
          class="p-2 rounded-xl border transition-all flex flex-col justify-between min-h-[95px] sm:min-h-[105px] cursor-pointer group ${
            isToday 
              ? 'bg-cyan-950/30 border-cyan-400 shadow-md shadow-cyan-500/10' 
              : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900'
          }"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold ${isToday ? 'text-cyan-400 font-black' : 'text-slate-400 group-hover:text-white'}">
              ${day}
            </span>
            ${isToday ? `<span class="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-1 rounded">TODAY</span>` : ''}
          </div>
          
          <div class="space-y-1 my-1 flex-1 overflow-hidden">
            ${visibleItems.join('')}
            ${remainingCount > 0 ? `
              <div class="text-[9px] font-mono text-cyan-400 font-bold">+${remainingCount} more</div>
            ` : ''}
          </div>

          <div class="text-[10px] font-mono text-slate-600 group-hover:text-cyan-400 transition-colors flex justify-end">
            <i class="fa-solid fa-plus opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </div>
        </div>
      `;
    }

    $grid.innerHTML = cellsHtml;

    if ($deadlineCount) {
      $deadlineCount.textContent = `${totalMonthDeadlines} task deadline${totalMonthDeadlines === 1 ? '' : 's'} this month`;
    }
  }

  // ==========================================
  // Deadline Alert Banner
  // ==========================================

  function initDeadlineAlertBanner() {
    const $btnDismiss = document.getElementById('btn-dismiss-deadline-alert');
    const $btnView = document.getElementById('btn-view-deadlines');

    if ($btnDismiss) {
      $btnDismiss.addEventListener('click', async () => {
        const todayStr = formatDateISO(new Date());
        userSettings.dismissedAlertDate = todayStr;
        const banner = document.getElementById('deadline-alert-banner');
        if (banner) banner.classList.add('hidden');
        await saveUserSettings({ dismissedAlertDate: todayStr });
      });
    }

    if ($btnView) {
      $btnView.addEventListener('click', () => {
        switchTab('panel-calendar');
      });
    }
  }

  function checkDeadlineAlerts() {
    const banner = document.getElementById('deadline-alert-banner');
    const titleEl = document.getElementById('deadline-alert-title');
    const msgEl = document.getElementById('deadline-alert-msg');
    if (!banner || !titleEl || !msgEl) return;

    // If notifications disabled
    if (userSettings.deadlineAlertDays === -1) {
      banner.classList.add('hidden');
      return;
    }

    const todayStr = formatDateISO(new Date());
    // If user dismissed for today
    if (userSettings.dismissedAlertDate === todayStr) {
      banner.classList.add('hidden');
      return;
    }

    const threshold = userSettings.deadlineAlertDays !== undefined ? userSettings.deadlineAlertDays : 1;
    let overdueCount = 0;
    let dueSoonCount = 0;
    const alertItems = [];

    cachedProjects.forEach(p => {
      if (!p.dueDate) return;
      const isDone = p.status === 'Published' || p.status === 'Completed';
      if (isDone) return;

      const diffDays = Math.round((new Date(p.dueDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        overdueCount++;
        alertItems.push(`"${p.title}" (overdue)`);
      } else if (diffDays <= threshold) {
        dueSoonCount++;
        alertItems.push(`"${p.title}" (${diffDays === 0 ? 'due today' : diffDays === 1 ? 'due tomorrow' : `due in ${diffDays} days`})`);
      }
    });

    if (overdueCount === 0 && dueSoonCount === 0) {
      banner.classList.add('hidden');
      return;
    }

    banner.classList.remove('hidden');

    if (overdueCount > 0) {
      titleEl.textContent = `⚠️ Urgent: ${overdueCount} Overdue Task${overdueCount === 1 ? '' : 's'}`;
    } else {
      titleEl.textContent = `⏰ ${dueSoonCount} Task Deadline${dueSoonCount === 1 ? '' : 's'} Approaching`;
    }

    const summaryParts = [];
    if (overdueCount > 0) summaryParts.push(`${overdueCount} overdue`);
    if (dueSoonCount > 0) summaryParts.push(`${dueSoonCount} due soon`);

    msgEl.textContent = `${summaryParts.join(' • ')}: ${alertItems.slice(0, 2).join(', ')}${alertItems.length > 2 ? ` and ${alertItems.length - 2} more` : ''}.`;
  }

  // ==========================================
  // Revenue & Cash Flow Analytics
  // ==========================================

  function renderRevenueOverview() {
    const projects = cachedProjects;

    let totalPaid = 0;
    let totalUnpaid = 0;

    projects.forEach(p => {
      const price = p.budget || p.price || 0;
      if (isPaidStatus(p.paymentStatus)) totalPaid += price;
      else totalUnpaid += price;
    });

    const $totalTracked = document.getElementById('rev-total-tracked');
    const $totalEarned = document.getElementById('rev-total-earned');
    const $projected = document.getElementById('rev-projected-unpaid');
    const $totalCount = document.getElementById('rev-total-count');

    if ($totalTracked) $totalTracked.textContent = formatMoney(totalPaid + totalUnpaid);
    if ($totalEarned) $totalEarned.textContent = formatMoney(totalPaid);
    if ($projected) $projected.textContent = formatMoney(totalUnpaid);
    if ($totalCount) $totalCount.textContent = `${projects.length} Tasks Tracked`;

    const $breakdownList = document.getElementById('revenue-breakdown-list');
    if ($breakdownList) {
      const projectItems = projects.map(p => {
        const price = p.budget || p.price || 0;
        const isPaid = isPaidStatus(p.paymentStatus);
        const status = p.status || 'Not Started';

        return `
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border ${!isPaid ? 'border-amber-500/30 bg-amber-950/10' : 'border-slate-800'} text-xs font-mono hover:border-slate-700 transition-colors">
            <div>
              <div class="font-bold text-white flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">${escapeHtml(p.service || 'Task')}</span>
                <span>${escapeHtml(p.title)}</span>
              </div>
              <div class="text-slate-400 text-[11px] mt-1 flex items-center gap-2">
                <span class="${status === 'Published' || status === 'Completed' ? 'text-emerald-400' : status === 'In Progress' ? 'text-cyan-400' : 'text-slate-400'} font-semibold">${status}</span>
                <span>&bull;</span>
                <span>client: <span class="text-slate-300 font-medium">${escapeHtml(p.clientName || 'Client')}</span></span>
                ${p.dueDate ? `<span>&bull;</span><span class="text-amber-300/80">due: ${p.dueDate}</span>` : ''}
              </div>
            </div>
            <div class="text-right flex items-center gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold font-mono ${isPaid ? 'text-emerald-400' : 'text-amber-400'}">${formatMoney(price)}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isPaid ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                }">
                  ${isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <button onclick="window.flowOpenEditVideo('${p.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 text-[11px] transition-colors cursor-pointer" title="Edit task details">
                Edit
              </button>
            </div>
          </div>
        `;
      });

      $breakdownList.innerHTML = projectItems.join('');
    }
  }

  // ==========================================
  // Master Render Coordinator
  // ==========================================

  function renderAll() {
    updateCurrencyDisplays();
    renderSidebarJobBoards();
    renderBoardQuickPills();
    updateBoardHeader();
    renderSheetTable();
    renderCalendar();
    renderRevenueOverview();
    checkDeadlineAlerts();
    renderAddTaskPanel();
  }

})();
