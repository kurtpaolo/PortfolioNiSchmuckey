<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmuckey</title>
  <meta name="description" content="Freelance Tasks, Deliverables & Revenue Tracker">
  <meta name="theme-color" content="#07090e">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
  
  <!-- FontAwesome 6 Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            flow: {
              bg: '#07090e',
              panel: '#0d121d',
              cyan: '#00f2fe',
              blue: '#38bdf8',
              indigo: '#6366f1',
              emerald: '#10b981',
              amber: '#f59e0b',
              purple: '#a855f7',
              rose: '#f43f5e',
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Outfit', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Freelance Flow Styles -->
  <link rel="stylesheet" href="css/app.css">
</head>
<body class="h-full cyber-grid-bg text-slate-100 font-sans antialiased overflow-hidden select-none">

  <!-- Glow blobs in the background -->
  <div class="glow-orb-cyan top-[-150px] left-[-150px]"></div>
  <div class="glow-orb-purple bottom-[-150px] right-[-150px]"></div>

  <!-- Login & Register modal gate -->
  <div id="login-gate" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e] transition-opacity duration-200 overflow-y-auto flow-scrollbar">
    <div class="w-full max-w-md relative z-10">
      
      <!-- Top Link back to Portfolio -->
      <div class="mb-4 flex items-center justify-between">
        <a href="index.php" class="exit-to-portfolio-btn text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-2 transition-colors py-1 px-2 rounded hover:bg-slate-900/60">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Go to Public Portfolio</span>
        </a>
        <span class="text-[11px] font-mono text-cyan-400/90 uppercase tracking-widest flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          CREATOR PORTAL
        </span>
      </div>

      <!-- Auth Glass Card -->
      <div class="flow-card rounded-2xl p-5 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
            <i class="fa-solid fa-layer-group text-2xl text-white"></i>
          </div>
          <h2 class="font-heading font-black text-2xl tracking-wide text-white">
            schmuck<span class="text-cyan-400">ey</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1 font-mono">
            Tasks & Revenue Tracker
          </p>
        </div>

        <!-- Mode Toggle Tabs (Sign In vs Create Account) -->
        <div class="grid grid-cols-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold font-mono mb-5">
          <button 
            type="button" 
            id="tab-btn-signin" 
            class="py-2 px-3 rounded-lg text-center transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-right-to-bracket text-xs"></i>
            <span>Sign In</span>
          </button>
          <button 
            type="button" 
            id="tab-btn-register" 
            class="py-2 px-3 rounded-lg text-center transition-all text-slate-400 hover:text-white cursor-pointer flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-user-plus text-xs"></i>
            <span>Create Account</span>
          </button>
        </div>

        <!-- Feedback Alert -->
        <div id="login-feedback" class="hidden"></div>

        <!-- Form 1: Sign In -->
        <form id="login-form" class="space-y-4">
          <div>
            <label for="login-username" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Username
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <i class="fa-solid fa-user text-sm"></i>
              </span>
              <input 
                type="text" 
                id="login-username" 
                required 
                autocomplete="username"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="Enter username"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              >
            </div>
          </div>

          <div>
            <label for="login-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Password
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <i class="fa-solid fa-key text-sm"></i>
              </span>
              <input 
                type="password" 
                id="login-password" 
                required 
                autocomplete="current-password"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="Enter password"
                class="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              >
              <button 
                type="button" 
                id="toggle-password-btn" 
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-cyan-400 cursor-pointer"
                aria-label="Toggle password"
              >
                <i class="fa-solid fa-eye text-sm"></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            id="login-btn" 
            class="btn-flow-primary w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-lg"
          >
            <span id="login-btn-text">
              <i class="fa-solid fa-right-to-bracket mr-1.5"></i> Sign In
            </span>
            <span id="login-btn-spinner" class="hidden">
              <i class="fa-solid fa-circle-notch fa-spin mr-1.5"></i> Authenticating...
            </span>
          </button>
        </form>

        <!-- Form 2: Create Account (Register) -->
        <form id="register-form" class="space-y-4 hidden">
          <div>
            <label for="reg-username" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Username
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <i class="fa-solid fa-user-plus text-sm"></i>
              </span>
              <input 
                type="text" 
                id="reg-username" 
                required 
                autocomplete="username"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="Unique username"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              >
            </div>
          </div>

          <div>
            <label for="reg-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Password
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <i class="fa-solid fa-key text-sm"></i>
              </span>
              <input 
                type="password" 
                id="reg-password" 
                required 
                autocomplete="new-password"
                placeholder="At least 4 characters"
                class="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              >
              <button 
                type="button" 
                id="toggle-reg-password-btn" 
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-cyan-400 cursor-pointer"
                aria-label="Toggle password"
              >
                <i class="fa-solid fa-eye text-sm"></i>
              </button>
            </div>
          </div>

          <div>
            <label for="reg-confirm-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Confirm Password
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <i class="fa-solid fa-circle-check text-sm"></i>
              </span>
              <input 
                type="password" 
                id="reg-confirm-password" 
                required 
                autocomplete="new-password"
                placeholder="Repeat password"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              >
            </div>
          </div>

          <button 
            type="submit" 
            id="register-btn" 
            class="btn-flow-primary w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-lg"
          >
            <span id="reg-btn-text">
              <i class="fa-solid fa-user-plus mr-1.5"></i> Create My Account
            </span>
            <span id="reg-btn-spinner" class="hidden">
              <i class="fa-solid fa-circle-notch fa-spin mr-1.5"></i> Setting Up Workspace...
            </span>
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-slate-800 text-center">
          <p class="text-[11px] text-slate-500">
            Track your work and money more efficiently.
          </p>
        </div>

      </div>
    </div>
  </div>


  <!-- Main tracker dashboard (shown after logging in) -->
  <div id="admin-app" class="hidden h-screen max-h-screen flex flex-col overflow-hidden relative z-10">

    <!-- Top header with clock, lock button, and exit -->
    <header class="flex-shrink-0 sticky top-0 z-30 bg-[#0a0e17] border-b border-cyan-500/25 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      
      <!-- Brand & Security Clearance -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
          <i class="fa-solid fa-layer-group text-sm"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-heading font-black text-lg tracking-wider text-white">
              MY <span class="text-cyan-400">APP</span>
            </span>
            <span class="hidden sm:flex text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-green"></span>
              <span id="current-user-display">user: ky</span>
            </span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono">
            Freelance Tasks & Cashflow Workspace
          </div>
        </div>
      </div>

      <!-- Controls & Exit -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Live System Clock -->
        <div class="hidden lg:flex flex-col items-end px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs">
          <div class="text-cyan-400 font-bold tracking-wider" id="flow-clock">00:00:00</div>
          <div class="text-[10px] text-slate-500" id="flow-date">Loading...</div>
        </div>

        <!-- Log Out / Lock Button -->
        <!-- <button 
          type="button" 
          class="lock-console-btn px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Sign Out / Lock Workspace"
        >
          <i class="fa-solid fa-lock text-xs"></i>
          <span class="hidden md:inline">Lock / Sign Out</span>
        </button> -->

        <!-- Exit & Return to Public Portfolio -->
        <button 
          type="button" 
          class="exit-to-portfolio-btn btn-flow-danger px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg"
          title="Safely exit and return to portfolio"
        >
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span class="hidden sm:inline">Exit to Portfolio</span>
          <span class="sm:hidden">Exit</span>
        </button>

      </div>
    </header>

    <!-- Workspace body: left sidebar and main panel content -->
    <div class="admin-workspace flex-1 flex overflow-hidden min-h-0 min-w-0">
      
      <!-- Left navigation sidebar (fixed so only the main area scrolls) -->
      <aside class="admin-sidebar w-64 flex-shrink-0 bg-[#090d16]/90 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex h-full overflow-y-auto flow-scrollbar">
        <div class="space-y-1 flex-shrink-0">
          <div class="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            SECTIONS
          </div>

          <!-- Task Tracker Accordion Group -->
          <div id="task-tracker-accordion-group" class="space-y-1">
            <button 
              id="nav-task-tracker-toggle"
              type="button" 
              class="nav-tab-btn active w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-cyan-400 transition-all text-left relative group cursor-pointer" 
              data-target="panel-projects"
            >
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-list-check w-4 text-center text-cyan-400"></i>
                <span>Task Tracker</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span id="sidebar-total-tasks-badge" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">0</span>
                <i id="task-tracker-caret" class="fa-solid fa-chevron-down text-[10px] text-slate-500 group-hover:text-cyan-400 transition-transform duration-200"></i>
              </div>
            </button>

            <!-- Sub-boards Tree (Indented, collapsible) -->
            <div id="sidebar-job-boards-tree" class="pl-4 pr-1 space-y-1 py-1 transition-all duration-200">
              <!-- Dynamically populated via app.js -->
            </div>
          </div>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-cyan-400 transition-all text-left relative" data-target="panel-calendar">
            <i class="fa-solid fa-calendar-days w-4 text-center text-cyan-400"></i>
            <span>Calendar &amp; Deadlines</span>
          </button>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-cyan-400 transition-all text-left relative" data-target="panel-revenue">
            <i class="fa-solid fa-chart-line w-4 text-center text-emerald-400"></i>
            <span>Revenue &amp; Cash Flow</span>
          </button>

          <button class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-cyan-400 transition-all text-left relative" data-target="panel-new-proj">
            <i class="fa-solid fa-plus-circle w-4 text-center text-amber-400"></i>
            <span>Add New Task</span>
          </button>
        </div>

        <!-- Sidebar Footer -->
        <div class="pt-4 border-t border-slate-800/80 space-y-2 flex-shrink-0">
          <div class="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span class="text-cyan-400 font-bold block mb-0.5">Private Workspace</span>
            <span>Your records are tied to your account.</span>
          </div>
          <!-- Account Settings Button -->
          <button 
            type="button" 
            id="btn-open-security-modal"
            class="w-full py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400/50 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
            title="Manage your workspace preferences & credentials"
          >
            <i class="fa-solid fa-sliders text-cyan-400 group-hover:rotate-45 transition-transform"></i>
            <span>Workspace &amp; Settings</span>
          </button>

          <button class="exit-to-portfolio-btn w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Return to Portfolio</span>
          </button>
        </div>
      </aside>

      <!-- Main scrollable panel container -->
      <main class="admin-main flex-1 overflow-y-auto flow-scrollbar min-h-0 min-w-0 p-4 sm:p-6 lg:p-8">
        
        <!-- Mobile Tab Switcher -->
        <div class="md:hidden flex overflow-x-auto gap-2 pb-3 mb-4 border-b border-slate-800 text-xs">
          <button class="nav-tab-btn active px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 whitespace-nowrap" data-target="panel-projects">Task Tracker</button>
          <button class="nav-tab-btn px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 whitespace-nowrap" data-target="panel-calendar">Calendar</button>
          <button class="nav-tab-btn px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 whitespace-nowrap" data-target="panel-revenue">Revenue</button>
          <button class="nav-tab-btn px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 whitespace-nowrap" data-target="panel-new-proj">Add Task</button>
        </div>

        <!-- Deadline Notification Banner -->
        <div id="deadline-alert-banner" class="hidden mb-4 p-3.5 sm:p-4 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-950/30">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 text-sm">
              <i class="fa-solid fa-bell"></i>
            </div>
            <div>
              <span class="font-bold text-white block text-sm" id="deadline-alert-title">Deadlines Approaching</span>
              <span class="text-amber-300/90 text-xs font-mono" id="deadline-alert-msg">You have tasks due soon.</span>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button type="button" id="btn-view-deadlines" class="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer">
              View in Calendar
            </button>
            <button type="button" id="btn-dismiss-deadline-alert" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-amber-500/20 transition-colors cursor-pointer" title="Don't remind me again today">
              Dismiss for Today
            </button>
          </div>
        </div>

        <!-- Panel 1: Task tracker -->
        <section id="panel-projects" class="flow-tab-panel h-full flex flex-col min-h-0 space-y-4">
          <div class="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-sm">
                  <i id="current-board-icon" class="fa-solid fa-video"></i>
                  <span id="current-board-badge">Video Editor</span>
                </span>
                <span class="text-[11px] text-slate-500 font-mono hidden sm:inline" id="current-board-subtext">Dedicated Workspace Table</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-2">
                <span id="current-board-title">Video Editor</span> <span class="text-cyan-400">Tasks</span>
              </h1>
              <p class="text-xs text-slate-400 font-mono mt-1" id="current-board-desc">
                Track deliverables, rates, deadlines, and status for this job.
              </p>
            </div>

            <!-- Controls: Job switcher pills, Columns, Add Task -->
            <div class="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <!-- Quick Board Switcher Pills (for instant switching right above the table) -->
              <div id="board-quick-pills" class="flex items-center gap-1.5 overflow-x-auto py-1">
                <!-- Injected dynamically: [🎬 Video Editor] [📸 Photographer] [✨ All] -->
              </div>

              <!-- Manage Columns Button -->
              <button 
                id="btn-open-manage-columns" 
                type="button" 
                class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer" 
                title="Manage visible columns for this job board"
              >
                <i class="fa-solid fa-table-columns text-cyan-400"></i>
                <span class="hidden sm:inline">Columns</span>
              </button>

              <!-- Add Custom Column Button -->
              <button 
                id="btn-open-add-column" 
                type="button" 
                class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer" 
                title="Add a custom column to this job board"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span class="hidden sm:inline">Add Column</span>
              </button>

              <!-- Add Task Button -->
              <button 
                id="btn-open-add-video" 
                type="button" 
                class="btn-flow-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <i class="fa-solid fa-plus"></i>
                <span>Add Task</span>
              </button>
            </div>
          </div>

          <!-- Quick stats bar (total, paid, unpaid) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
            <!-- Total Tracked -->
            <div class="flow-card p-4 rounded-xl border border-cyan-500/40">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-list-check"></i> Total Tracked
                </div>
              </div>
              <div class="text-2xl font-black font-heading text-cyan-400 mt-1.5" id="project-total-count">0 Tasks</div>
            </div>

            <!-- Total Paid -->
            <div class="flow-card p-4 rounded-xl border border-emerald-500/30">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-check"></i> Total Paid
                </div>
              </div>
              <div class="text-2xl font-black font-heading text-emerald-400 mt-1.5" id="project-paid-amount">$0.00</div>
            </div>

            <!-- Total Unpaid -->
            <div class="flow-card p-4 rounded-xl border border-amber-500/30">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-hourglass-half"></i> Total Unpaid
                </div>
              </div>
              <div class="text-2xl font-black font-heading text-amber-400 mt-1.5" id="project-unpaid-amount">$0.00</div>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-500 text-xs"></i>
              <input type="text" id="project-search-input" placeholder="Search task title or status..." class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
            </div>

            <div class="flex items-center gap-2">
              <div id="project-filter-indicator" class="hidden"></div>
            </div>
          </div>

          <!-- Table container for tasks -->
          <div id="sheet-table-container" class="flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Populated dynamically via app.js (renderSheetTable) -->
          </div>
        </section>


        <!-- Panel: Calendar & Deadlines -->
        <section id="panel-calendar" class="flow-tab-panel hidden h-full flex flex-col min-h-0 space-y-4">
          <div class="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Calendar &amp; <span class="text-cyan-400">Deadlines</span>
              </h1>
              <p class="text-xs text-slate-400 font-mono mt-1">
                Project delivery dates, client calls, shoots, and milestones.
              </p>
            </div>

            <!-- Calendar Navigation & Actions -->
            <div class="flex items-center gap-2 flex-wrap">
              <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                <button id="cal-prev-month-btn" type="button" class="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer" title="Previous Month">
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <div id="cal-current-month-display" class="px-3 py-1 font-heading font-black text-sm text-white font-mono min-w-[130px] text-center">
                  Loading...
                </div>
                <button id="cal-next-month-btn" type="button" class="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer" title="Next Month">
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>

              <button id="cal-today-btn" type="button" class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-cyan-300 font-mono font-bold transition-all cursor-pointer">
                Today
              </button>

              <button onclick="window.flowOpenAddVideo()" type="button" class="btn-flow-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg" title="Create a new client task deliverable">
                <i class="fa-solid fa-plus"></i>
                <span>Add Task</span>
              </button>

              <button id="btn-open-add-event" type="button" class="px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg" title="Schedule a call, shoot, or milestone">
                <i class="fa-solid fa-calendar-plus text-purple-400"></i>
                <span>Add Event</span>
              </button>
            </div>
          </div>

          <!-- Calendar Legend & Stats -->
          <div class="flex-shrink-0 flex items-center justify-between gap-3 flex-wrap text-[11px] font-mono text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
            <div class="flex items-center gap-4 flex-wrap">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span> Overdue</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span> Due Soon</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></span> Task Due</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span> Completed</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></span> Event / Call</span>
            </div>
            <div id="cal-deadline-count" class="text-xs font-bold text-slate-300">
              0 Deadlines this month
            </div>
          </div>

          <!-- Calendar Grid Wrapper -->
          <div class="flex-1 min-h-[460px] overflow-auto flow-scrollbar rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4 flex flex-col">
            <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 pb-2">
              <span class="text-rose-400">Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span class="text-cyan-400">Sat</span>
            </div>
            <div id="calendar-days-grid" class="grid grid-cols-7 gap-1 sm:gap-2 flex-1 auto-rows-fr">
              <!-- Rendered dynamically by app.js -->
            </div>
          </div>
        </section>


        <!-- Panel 2: Revenue and cash flow overview -->
        <section id="panel-revenue" class="flow-tab-panel hidden h-full flex flex-col min-h-0 space-y-4">
          <div class="flex-shrink-0">
            <h1 class="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              Revenue &amp; Cash Flow <span class="text-emerald-400">Overview</span>
            </h1>
            <p class="text-xs text-slate-400 font-mono mt-1">
              Real-time monitoring of collected income, and pending recievables.
            </p>
          </div>

          <!-- Metric Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
            <div class="flow-card p-4 rounded-xl border border-cyan-500/30">
              <div class="text-[11px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <i class="fa-solid fa-layer-group"></i> Total Tracked
              </div>
              <div class="text-2xl font-black font-heading text-cyan-400 mt-1.5" id="rev-total-tracked">$0.00</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1" id="rev-total-count">0 Deliverables Logged</div>
            </div>

            <div class="flow-card p-4 rounded-xl border border-emerald-500/30">
              <div class="text-[11px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check"></i> Total Paid
              </div>
              <div class="text-2xl font-black font-heading text-emerald-400 mt-1.5" id="rev-total-earned">$0.00</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">Cleared &amp; Paid Payments</div>
            </div>

            <div class="flow-card p-4 rounded-xl border border-amber-500/30">
              <div class="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <i class="fa-solid fa-hourglass-half"></i> Total Unpaid
              </div>
              <div class="text-2xl font-black font-heading text-amber-400 mt-1.5" id="rev-projected-unpaid">$0.00</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">Pending Balances Due</div>
            </div>
          </div>

          <!-- Cash flow breakdown by client list -->
          <div class="flow-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex-1 min-h-0 flex flex-col overflow-hidden space-y-3">
            <h3 class="text-sm sm:text-base font-bold text-white font-heading flex items-center gap-2 flex-shrink-0">
              <i class="fa-solid fa-money-bill-transfer text-emerald-400"></i>
              <span>Cash Flow Breakdown by Engagement</span>
            </h3>
            <div id="revenue-breakdown-list" class="space-y-2.5 flex-1 min-h-0 overflow-y-auto flow-scrollbar pr-1.5">
              <!-- Injected dynamically -->
            </div>
          </div>
        </section>


        <!-- Panel 4: Add new task form -->
        <section id="panel-new-proj" class="flow-tab-panel hidden flex-1 min-h-0 overflow-y-auto flow-scrollbar space-y-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              Add New <span class="text-cyan-400">Task</span>
            </h1>
            <p class="text-xs text-slate-400 font-mono mt-1">
              Select a job board to configure deliverables, rate, and deadline.
            </p>
          </div>

          <!-- Step 1: Choose Job Board FIRST -->
          <div class="space-y-2.5 max-w-2xl">
            <div class="flex items-center justify-between">
              <label class="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <i class="fa-solid fa-layer-group text-cyan-400"></i>
                <span>Choose Job Board</span>
              </label>
              <span id="add-task-board-status-hint" class="text-[11px] font-mono text-slate-500">Pick a board to show form</span>
            </div>

            <!-- Dynamic Board Selector Cards (Strictly ONLY freelancer's active boards) -->
            <div id="add-task-board-cards" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <!-- Rendered dynamically from userSettings.boards -->
            </div>
          </div>

          <!-- Prompt displayed BEFORE a job board is selected -->
          <div id="add-task-no-board-prompt" class="flow-card rounded-2xl p-8 border border-dashed border-slate-800 text-center max-w-2xl">
            <div class="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <i class="fa-solid fa-arrow-pointer text-lg"></i>
            </div>
            <h3 class="text-sm font-heading font-bold text-white mb-1">Select a Job Board</h3>
            <p class="text-xs text-slate-400 font-mono">Choose one of your active job boards above to open the deliverable form.</p>
          </div>

          <!-- Step 2: Form Container (Hidden until a job board is chosen) -->
          <div id="add-task-form-wrapper" class="hidden flow-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 max-w-2xl shadow-xl">
            <form id="new-project-form" class="space-y-4">
              <input type="hidden" id="proj-board-id" value="">
              <select id="proj-board-select" class="hidden"></select>

              <!-- Selected Board Header Info Badge -->
              <div class="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-800">
                <div class="flex items-center gap-2.5">
                  <div id="add-task-active-icon-badge" class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-sm">
                    <i id="add-task-active-icon" class="fa-solid fa-briefcase"></i>
                  </div>
                  <div>
                    <h3 id="add-task-active-board-name" class="text-sm font-bold text-white font-heading">Job Board</h3>
                    <p class="text-[10px] text-slate-400 font-mono">Deliverable specifications &amp; table fields</p>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">Active Board</span>
              </div>

              <!-- Universal Core Fields (Strictly NO Placeholders) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-300 uppercase mb-1">Task Title *</label>
                  <input type="text" id="proj-title" required class="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-300 uppercase mb-1">Client Name *</label>
                  <input type="text" id="proj-client-name" required class="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-300 uppercase mb-1">Price (<span class="currency-label">$</span>) *</label>
                  <input type="number" id="proj-budget" required min="0" step="any" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-300 uppercase mb-1">Due Date</label>
                  <input type="date" id="proj-due-date" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-300 uppercase mb-1">Status</label>
                  <select id="proj-status" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
                    <option value="In Progress" selected>In Progress</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Published">Completed / Delivered</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-300 uppercase mb-1">Payment Status</label>
                  <select id="proj-payment" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
                    <option value="Unpaid" selected>Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <!-- Board Specific Custom Columns (Table fields for this job board) -->
              <div id="proj-custom-fields-container" class="space-y-3 pt-1"></div>

              <div class="flex justify-end pt-3 border-t border-slate-800">
                <button type="submit" class="btn-flow-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg">
                  <i class="fa-solid fa-plus"></i>
                  <span>Add Task</span>
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>
    </div>

  </div>

  <!-- Add / Edit Task Modal -->
  <div id="video-modal-dialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e]/95 hidden">
    <div class="w-full max-w-lg flow-card rounded-2xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto flow-scrollbar">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <i class="fa-solid fa-list-check text-sm"></i>
          </div>
          <div>
            <h3 id="modal-video-heading" class="text-base font-bold text-white font-heading">Edit Task</h3>
            <p class="text-[11px] text-slate-400 font-mono">Update deliverables, deadline, and payment status</p>
          </div>
        </div>
        <button type="button" id="btn-close-video-modal" class="text-slate-500 hover:text-white p-1 rounded-lg cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form id="video-editor-form" class="space-y-4">
        <input type="hidden" id="edit-video-id" value="">

        <div>
          <label for="modal-proj-board-select" class="block text-xs font-mono text-slate-300 uppercase mb-1">Job Board / Discipline</label>
          <select id="modal-proj-board-select" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer">
            <!-- Populated dynamically -->
          </select>
        </div>

        <div>
          <label for="input-video-title" class="block text-xs font-mono text-slate-300 uppercase mb-1">Task Title *</label>
          <input type="text" id="input-video-title" required class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
        </div>

        <div>
          <label for="input-video-client" class="block text-xs font-mono text-slate-300 uppercase mb-1">Client Name *</label>
          <input type="text" id="input-video-client" required class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="input-video-price" class="block text-xs font-mono text-slate-300 uppercase mb-1">Price (<span class="currency-label">$</span>) *</label>
            <input type="number" id="input-video-price" required min="1" step="any" value="0" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
          </div>
          <div>
            <label for="input-video-due-date" class="block text-xs font-mono text-slate-300 uppercase mb-1">Due Date / Deadline</label>
            <input type="date" id="input-video-due-date" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="input-video-status" class="block text-xs font-mono text-slate-300 uppercase mb-1">Status</label>
            <select id="input-video-status" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
              <option value="Published">Completed / Delivered</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
          <div>
            <label for="input-video-payment" class="block text-xs font-mono text-slate-300 uppercase mb-1">Payment Status</label>
            <select id="input-video-payment" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <!-- Dynamic Container for Custom Column Inputs -->
        <div id="modal-custom-fields-container" class="space-y-3 pt-1 border-t border-slate-800/80"></div>

        <!-- Hidden legacy fields for compatibility -->
        <input type="hidden" id="input-video-raw" value="">
        <input type="hidden" id="input-video-link" value="">

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button type="button" id="btn-cancel-video-modal" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Account Settings Modal -->
  <div id="security-modal-dialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e]/95 hidden overflow-y-auto flow-scrollbar">
    <div class="w-full max-w-xl flow-card rounded-2xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <i class="fa-solid fa-user-gear text-base"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-white font-heading">Settings &amp; Workspace</h3>
          </div>
        </div>
        <button type="button" id="btn-close-security-modal" class="text-slate-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Feedback Alert inside Modal -->
      <div id="security-modal-feedback" class="hidden mb-4 p-2.5 rounded-lg text-xs font-mono flex-shrink-0"></div>

      <!-- Settings Selector Tabs (Preferences, Job Boards, Change Username, Change Password) -->
      <div class="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-5 text-xs font-mono flex-shrink-0">
        <button type="button" id="tab-opt-prefs" class="account-setting-tab flex-1 py-2 px-2.5 rounded-lg font-bold transition-all bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-sliders"></i>
          <span>Preferences</span>
        </button>
        <button type="button" id="tab-opt-jobs" class="account-setting-tab flex-1 py-2 px-2.5 rounded-lg font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-briefcase"></i>
          <span>Job Boards</span>
        </button>
        <button type="button" id="tab-opt-username" class="account-setting-tab flex-1 py-2 px-2.5 rounded-lg font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-user-pen"></i>
          <span>Username</span>
        </button>
        <button type="button" id="tab-opt-password" class="account-setting-tab flex-1 py-2 px-2.5 rounded-lg font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-key"></i>
          <span>Password</span>
        </button>
      </div>

      <!-- Scrollable Tab Content Wrapper -->
      <div class="flex-1 overflow-y-auto flow-scrollbar pr-1">
        <!-- Option 0: Workspace & UX Preferences Form -->
        <form id="form-workspace-prefs" class="space-y-4">
          <div>
            <label for="pref-currency-select" class="block text-xs font-mono text-slate-300 uppercase mb-1">Currency Symbol</label>
            <select id="pref-currency-select" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer">
              <option value="$">$ (USD - United States Dollar)</option>
              <option value="₱">₱ (PHP - Philippine Peso)</option>
            </select>
            <p class="text-[11px] text-slate-500 font-mono mt-1">1 USD = ₱56.00. Changing currency converts all project prices, budgets, and cashflows to their equivalent value in real-time.</p>
          </div>

          <div>
            <label for="pref-deadline-alert" class="block text-xs font-mono text-slate-300 uppercase mb-1">Deadline Warning Alert</label>
            <select id="pref-deadline-alert" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
              <option value="1">1 Day Before &amp; On Due Date (Recommended)</option>
              <option value="2">2 Days Before &amp; On Due Date</option>
              <option value="3">3 Days Before &amp; On Due Date</option>
              <option value="0">On Due Date Only</option>
              <option value="-1">Disabled (Do not notify)</option>
            </select>
            <p class="text-[11px] text-slate-500 font-mono mt-1">Controls when the dashboard reminder banner alerts you for upcoming tasks.</p>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" class="btn-cancel-account-modal px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" id="btn-submit-prefs" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer">
              <span id="prefs-btn-text"><i class="fa-solid fa-check mr-1"></i> Save Preferences</span>
              <span id="prefs-btn-spinner" class="hidden"><i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Saving...</span>
            </button>
          </div>
        </form>

        <!-- Option 1: Manage Job Boards Section -->
        <div id="section-manage-jobs" class="space-y-6 hidden">
          <!-- Section: Active Job Boards -->
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <span class="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <i class="fa-solid fa-layer-group"></i> Active Job Boards
              </span>
              <span class="text-[11px] font-mono text-slate-500" id="manage-jobs-count-text">1 Active</span>
            </div>
            <div id="manage-active-jobs-list" class="space-y-2 max-h-56 overflow-y-auto flow-scrollbar pr-1">
              <!-- Dynamic active job cards rendered here -->
            </div>
          </div>

          <!-- Section: Quick-Add From Preset Library -->
          <div>
            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mb-2.5">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i> Add from Preset Library
            </span>
            <div id="manage-preset-library-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Dynamic preset cards e.g. Photographer, Designer, Developer, Writer, etc. -->
            </div>
          </div>

          <!-- Section: Create Custom Job Board -->
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-plus-circle text-cyan-400"></i> Create Custom Job Board
            </span>
            <p class="text-[11px] text-slate-400 font-mono">
              Offer a unique service? Create a custom board with its own icon and separate task table.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Job Title *</label>
                <input type="text" id="custom-job-name" placeholder="e.g. 3D Animator, Voice Actor, SEO" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
              </div>
              <div>
                <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Icon</label>
                <select id="custom-job-icon" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer">
                  <option value="fa-briefcase">💼 Briefcase</option>
                  <option value="fa-microphone">🎙️ Microphone</option>
                  <option value="fa-cubes">🧊 3D / Cubes</option>
                  <option value="fa-music">🎵 Music / Audio</option>
                  <option value="fa-bullhorn">📢 Marketing</option>
                  <option value="fa-paint-brush">🖌️ Art / Illustration</option>
                  <option value="fa-wand-magic-sparkles">✨ Effects / VFX</option>
                  <option value="fa-chart-line">📊 Analytics / SEO</option>
                  <option value="fa-gamepad">🎮 Game Dev</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end pt-1">
              <button type="button" id="btn-create-custom-job" class="btn-flow-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                <i class="fa-solid fa-plus"></i>
                <span>Create Board</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end pt-3 border-t border-slate-800">
            <button type="button" class="btn-cancel-account-modal px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">
              Done
            </button>
          </div>
        </div>

      <!-- Option 1: Change Username Form -->
      <form id="form-change-username" class="space-y-4 hidden">
        <div>
          <label for="input-new-username" class="block text-xs font-mono text-slate-300 uppercase mb-1">New Username *</label>
          <input type="text" id="input-new-username" required minlength="2" maxlength="50" autocomplete="username" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" placeholder="Enter new username">
        </div>

        <div>
          <label for="input-user-current-pass" class="block text-xs font-mono text-slate-300 uppercase mb-1">Current Password *</label>
          <input type="password" id="input-user-current-pass" required autocomplete="current-password" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" placeholder="Enter current password to authorize">
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button type="button" class="btn-cancel-account-modal px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors">
            Cancel
          </button>
          <button type="submit" id="btn-submit-username" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
            <span id="username-btn-text"><i class="fa-solid fa-check mr-1"></i> Save Username</span>
            <span id="username-btn-spinner" class="hidden"><i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Saving...</span>
          </button>
        </div>
      </form>

      <!-- Option 2: Change Password Form -->
      <form id="form-change-password" class="space-y-4 hidden">
        <div>
          <label for="input-pass-current" class="block text-xs font-mono text-slate-300 uppercase mb-1">Current Password *</label>
          <input type="password" id="input-pass-current" required autocomplete="current-password" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" placeholder="Enter current password">
        </div>

        <div>
          <label for="input-pass-new" class="block text-xs font-mono text-slate-300 uppercase mb-1">New Password *</label>
          <input type="password" id="input-pass-new" required minlength="2" autocomplete="new-password" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" placeholder="Enter new password">
        </div>

        <div>
          <label for="input-pass-confirm" class="block text-xs font-mono text-slate-300 uppercase mb-1">Confirm New Password *</label>
          <input type="password" id="input-pass-confirm" required minlength="2" autocomplete="new-password" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" placeholder="Re-type new password">
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button type="button" class="btn-cancel-account-modal px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors">
            Cancel
          </button>
          <button type="submit" id="btn-submit-password" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
            <span id="pass-btn-text"><i class="fa-solid fa-lock mr-1"></i> Save Password</span>
            <span id="pass-btn-spinner" class="hidden"><i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Updating...</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>

  <!-- Add Custom Column Modal -->
  <div id="custom-column-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e]/95 hidden">
    <div class="w-full max-w-md flow-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <i class="fa-solid fa-plus text-sm"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-white font-heading">Add Custom Column</h3>
            <p class="text-[11px] text-slate-400 font-mono">Add an extra field to your task table</p>
          </div>
        </div>
        <button type="button" id="btn-close-add-column-modal" class="text-slate-500 hover:text-white p-1 rounded-lg cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form id="add-column-form" class="space-y-4">
        <div>
          <label for="new-col-label" class="block text-xs font-mono text-slate-300 uppercase mb-1">Column Name *</label>
          <input type="text" id="new-col-label" required placeholder="e.g. Figma Board, Revisions, Invoice #" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
        </div>

        <div>
          <label for="new-col-type" class="block text-xs font-mono text-slate-300 uppercase mb-1">Column Type</label>
          <select id="new-col-type" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
            <option value="url">🔗 Web Link / URL (Clickable)</option>
            <option value="text">📝 Text / Notes</option>
            <option value="number">🔢 Number (Counts, Hours, etc.)</option>
            <option value="date">📅 Date</option>
            <option value="tag">🏷️ Tag / Badge</option>
          </select>
        </div>

        <!-- Quick suggestion pills -->
        <div>
          <label class="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">Quick Suggestions:</label>
          <div class="flex flex-wrap gap-1.5">
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="Figma Board" data-type="url">+ Figma</button>
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="GitHub Repo" data-type="url">+ GitHub</button>
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="Live Demo" data-type="url">+ Live Demo</button>
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="Shoot Location" data-type="text">+ Location</button>
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="Word Count" data-type="number">+ Word Count</button>
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="Revision Round" data-type="text">+ Revisions</button>
            <button type="button" class="btn-col-preset px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors" data-label="Invoice #" data-type="text">+ Invoice #</button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button type="button" id="btn-cancel-add-column" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
            Add Column
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Manage Columns Modal -->
  <div id="manage-columns-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e]/95 hidden">
    <div class="w-full max-w-lg flow-card rounded-2xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl relative max-h-[85vh] flex flex-col">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <i class="fa-solid fa-table-columns text-sm"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-white font-heading">Manage Table Columns</h3>
            <p class="text-[11px] text-slate-400 font-mono">Toggle visibility or remove custom columns</p>
          </div>
        </div>
        <button type="button" id="btn-close-manage-columns-modal" class="text-slate-500 hover:text-white p-1 rounded-lg cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto flow-scrollbar space-y-3 pr-1">
        <div class="text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Active Columns in Tracker:</span>
          <button type="button" id="btn-add-col-from-manage" class="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer">
            <i class="fa-solid fa-plus"></i> Add Column
          </button>
        </div>

        <div id="manage-columns-list" class="space-y-2">
          <!-- Injected dynamically via app.js -->
        </div>

        <!-- Quick Switch Preset -->
        <div class="pt-4 border-t border-slate-800/80 space-y-2">
          <span class="text-xs font-mono text-slate-400 block">Apply Template Preset:</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button type="button" class="btn-apply-preset p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs text-white transition-all cursor-pointer" data-preset="video_editor">🎬 Video Editor</button>
            <button type="button" class="btn-apply-preset p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs text-white transition-all cursor-pointer" data-preset="designer">🎨 Designer</button>
            <button type="button" class="btn-apply-preset p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs text-white transition-all cursor-pointer" data-preset="photographer">📸 Photographer</button>
            <button type="button" class="btn-apply-preset p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs text-white transition-all cursor-pointer" data-preset="developer">💻 Developer</button>
            <button type="button" class="btn-apply-preset p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs text-white transition-all cursor-pointer" data-preset="writer">✍️ Writer</button>
            <button type="button" class="btn-apply-preset p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs text-white transition-all cursor-pointer" data-preset="general">⚡ General</button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-4 flex-shrink-0">
        <button type="button" id="btn-save-manage-columns" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
          Done
        </button>
      </div>
    </div>
  </div>

  <!-- Add / Edit Calendar Event Modal -->
  <div id="calendar-event-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e]/95 hidden">
    <div class="w-full max-w-md flow-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <i class="fa-solid fa-calendar-plus text-sm"></i>
          </div>
          <div>
            <h3 id="modal-event-heading" class="text-base font-bold text-white font-heading">Add Calendar Event</h3>
            <p class="text-[11px] text-slate-400 font-mono">Schedule a meeting, shoot date, or milestone</p>
          </div>
        </div>
        <button type="button" id="btn-close-event-modal" class="text-slate-500 hover:text-white p-1 rounded-lg cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form id="calendar-event-form" class="space-y-4">
        <input type="hidden" id="edit-event-id" value="">

        <div>
          <label for="input-event-title" class="block text-xs font-mono text-slate-300 uppercase mb-1">Event Title *</label>
          <input type="text" id="input-event-title" required placeholder="e.g. Client Kick-off Call, Pasig Shoot" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="input-event-date" class="block text-xs font-mono text-slate-300 uppercase mb-1">Date *</label>
            <input type="date" id="input-event-date" required class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
          </div>
          <div>
            <label for="input-event-time" class="block text-xs font-mono text-slate-300 uppercase mb-1">Time (Optional)</label>
            <input type="time" id="input-event-time" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
          </div>
        </div>

        <div>
          <label for="input-event-type" class="block text-xs font-mono text-slate-300 uppercase mb-1">Event Category</label>
          <select id="input-event-type" class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
            <option value="call">📞 Client Call / Meeting</option>
            <option value="shoot">📸 Shoot / On-Site Production</option>
            <option value="milestone">🚩 Milestone / Review Check-in</option>
            <option value="deadline">⏰ Hard Deadline</option>
            <option value="personal">💼 Personal / Freelance Admin</option>
          </select>
        </div>

        <div>
          <label for="input-event-notes" class="block text-xs font-mono text-slate-300 uppercase mb-1">Notes / Link (Optional)</label>
          <textarea id="input-event-notes" rows="2" placeholder="Zoom link, address, or agenda..." class="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"></textarea>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-800">
          <button type="button" id="btn-delete-event" class="hidden text-rose-400 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer">
            <i class="fa-solid fa-trash mr-1"></i> Delete
          </button>
          <div class="flex items-center gap-3 ml-auto">
            <button type="button" id="btn-cancel-event-modal" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="btn-flow-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
              Save Event
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Calendar Day Details Modal -->
  <div id="calendar-day-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e]/95 hidden">
    <div class="w-full max-w-md flow-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative max-h-[85vh] flex flex-col">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <i class="fa-solid fa-calendar-day text-sm"></i>
          </div>
          <div>
            <h3 id="cal-day-modal-title" class="text-base font-bold text-white font-heading">Schedule</h3>
            <p id="cal-day-modal-subtitle" class="text-[11px] text-slate-400 font-mono">Tasks and events scheduled</p>
          </div>
        </div>
        <button type="button" id="btn-close-day-modal" class="text-slate-500 hover:text-white p-1 rounded-lg cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div id="cal-day-modal-items" class="flex-1 overflow-y-auto flow-scrollbar space-y-2.5 pr-1">
        <!-- Rendered dynamically -->
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 flex-shrink-0 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-day-add-task" class="btn-flow-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg" title="Create a task with this deadline">
            <i class="fa-solid fa-list-check text-xs"></i>
            <span>+ Add Task</span>
          </button>
          <button type="button" id="btn-day-add-event" class="px-3 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm" title="Schedule a call, shoot, or milestone">
            <i class="fa-solid fa-calendar-plus text-xs text-purple-400"></i>
            <span>+ Add Event</span>
          </button>
        </div>
        <button type="button" id="btn-day-close" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Custom Popup Dialog Modal (Lil Popup for Warnings & Deletions) -->
  <div id="flow-dialog-modal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#07090e]/85 backdrop-blur-sm hidden">
    <div id="flow-dialog-card" class="w-full max-w-sm flow-card rounded-2xl p-5 border border-amber-500/40 shadow-2xl bg-[#0b0f19] relative">
      <div class="flex items-start gap-3.5">
        <div id="flow-dialog-icon-container" class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 text-base shadow-sm">
          <i id="flow-dialog-icon" class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h4 id="flow-dialog-title" class="text-sm font-bold text-white font-heading tracking-tight">Notice</h4>
          <p id="flow-dialog-message" class="text-xs text-slate-300 font-mono mt-1.5 leading-relaxed whitespace-pre-line"></p>
        </div>
      </div>
      
      <div id="flow-dialog-actions" class="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-800/80">
        <button type="button" id="flow-dialog-cancel-btn" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-medium text-slate-300 transition-colors cursor-pointer hidden">
          Cancel
        </button>
        <button type="button" id="flow-dialog-confirm-btn" class="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold transition-colors cursor-pointer shadow-md">
          OK
        </button>
      </div>
    </div>
  </div>

  <!-- App JavaScript -->
  <script src="js/app.js"></script>
</body>
</html>
