<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmuckey · Home</title>
  <meta name="description" content="Schmuckey - Content Creator & Video Editor. 14M+ views driven for YouTube creators, Roblox game promos, high-retention shorts, and cinematic trailers.">
  <meta name="theme-color" content="#0b0f19">
  
  <!-- Google Fonts: Inter & Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  
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
            brand: {
              cyan: '#06b6d4',
              cyanLight: '#22d3ee',
              blue: '#2563eb',
              blueDark: '#1d4ed8',
              slateBg: '#0b0f19',
              slateCard: '#0f172a',
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Outfit', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-[#0b0f19] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">

  <!-- Glow blobs in the background (clipped so mobile screens don't get weird horizontal scroll) -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="ambient-glow-cyan top-[-100px] left-[-100px]"></div>
    <div class="ambient-glow-blue top-[350px] right-[-120px]"></div>
  </div>

  <!-- Top navigation bar -->
  <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f19]/90 border-b border-cyan-500/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Brand Logo -->
        <a href="index.php" class="flex items-center gap-3 group">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
            <i class="fa-solid fa-play text-white text-lg ml-0.5 group-hover:rotate-12 transition-transform"></i>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-heading font-black text-[21.75px] tracking-wide text-white leading-none">schmuck<span class="gradient-text">ey</span></span>
            <span class="text-[12px] font-semibold text-cyan-400 mt-1 leading-none tracking-normal select-none">&quot;i miss you, be well&quot;</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="index.php" class="text-cyan-400 font-semibold transition-colors duration-200">Home</a>
          <a href="services.php" class="text-slate-300 hover:text-cyan-400 transition-colors duration-200">Services</a>
          <a href="about.php" class="text-slate-300 hover:text-cyan-400 transition-colors duration-200">About</a>
          <a href="contact.php" class="text-slate-300 hover:text-cyan-400 transition-colors duration-200">Contact</a>
        </nav>

        <!-- App link and Discord button -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Temporarily hidden for job application
          <a href="app.php" class="text-xs text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40">
            <i class="fa-solid fa-layer-group text-[11px] text-cyan-400"></i>
            <span>My App</span>
          </a>
          -->
          <a href="contact.php" class="gradient-btn px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg flex items-center gap-2">
            <i class="fa-brands fa-discord text-base"></i>
            <span>schmuck404</span>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button id="mobile-menu-btn" type="button" class="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-300 hover:text-cyan-400 focus:outline-none" aria-label="Toggle menu">
            <i id="menu-icon-open" class="fa-solid fa-bars text-xl"></i>
            <i id="menu-icon-close" class="fa-solid fa-xmark text-xl hidden"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div id="mobile-nav-menu" class="hidden md:hidden bg-slate-900/95 border-b border-cyan-500/20 px-4 pt-2 pb-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <a href="index.php" class="block px-3 py-2 rounded-md text-base font-semibold text-cyan-400 bg-cyan-950/40 border-l-2 border-cyan-400">Home</a>
      <a href="services.php" class="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60">Services</a>
      <a href="about.php" class="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60">About</a>
      <a href="contact.php" class="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60">Contact</a>
      <div class="pt-3 border-t border-slate-800 flex flex-col gap-2">
        <!-- Temporarily hidden for job application
        <a href="app.php" class="text-center py-2 px-3 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-1.5 font-medium">
          <i class="fa-solid fa-layer-group text-[11px] text-cyan-400"></i>
          <span>My App</span>
        </a>
        -->
        <a href="contact.php" class="gradient-btn text-center py-2.5 rounded-lg text-sm font-semibold text-white">
          <i class="fa-brands fa-discord mr-2"></i>Discord: schmuck404
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero section -->
    <section class="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- Left side: Bio and intro -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
              <span>Available for Video Editing & Collaborations</span>
            </div>

            <div class="hero-title-wrap max-w-2xl mx-auto lg:mx-0">
              <h1 class="hero-heading font-heading font-black leading-tight tracking-tight">
                howdy! i'm <span class="gradient-text">schmuckey</span>
              </h1>
            </div>

            <p class="text-justify text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
              A small content creator and video editor. I enjoy making very cool videos,
              <span class="text-cyan-300 font-semibold">from short-form content</span> and 
              <span class="text-cyan-300 font-semibold">roblox game promos</span> to 
              <span class="text-cyan-300 font-semibold">cinematic trailers</span> and 
              <span class="text-cyan-300 font-semibold">gameplay edits</span>. 
              I'm always looking to improve my work and build great partnerships.
            </p>

            <!-- Quick contact badges: Discord and Instagram -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0">
              
              <!-- Discord Contact Card (Left) -->
              <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-lg hover:border-cyan-400/60 transition-all">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] flex-shrink-0">
                    <i class="fa-brands fa-discord text-xl"></i>
                  </div>
                  <div class="text-left min-w-0">
                    <div class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate">Discord Contact</div>
                    <div class="text-xs sm:text-sm font-bold text-white font-mono truncate">@schmuck404</div>
                  </div>
                </div>
                <a href="contact.php" title="Reach out on Discord" class="w-9 h-9 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center transition-all hover:scale-105 flex-shrink-0" aria-label="Reach Out on Discord">
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              </div>

              <!-- Instagram Contact Card (Right) -->
              <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-lg hover:border-cyan-400/60 transition-all">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 flex-shrink-0">
                    <i class="fa-brands fa-instagram text-xl"></i>
                  </div>
                  <div class="text-left min-w-0">
                    <div class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate">Instagram Contact</div>
                    <div class="text-xs sm:text-sm font-bold text-white font-mono truncate">@schmuckeyy</div>
                  </div>
                </div>
                <a href="https://www.instagram.com/schmuckeyy" target="_blank" rel="noopener noreferrer" title="Reach out on Instagram" class="w-9 h-9 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center transition-all hover:scale-105 flex-shrink-0" aria-label="Reach Out on Instagram">
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              </div>

            </div>

            <!-- Quick anchor jumps (Clients, Sample Shorts, Cinematics) -->
            <div class="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1 max-w-2xl mx-auto lg:mx-0">
              
              <!-- Box 1: Clients -->
              <a href="#bludan" class="glass-card p-2.5 sm:p-3.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all text-left group flex flex-col justify-between shadow-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-handshake text-[11px] sm:text-xs"></i>
                  </div>
                  <i class="fa-solid fa-arrow-down text-[9px] sm:text-[10px] text-slate-500 group-hover:text-cyan-300 transition-colors"></i>
                </div>
                <div>
                  <div class="font-heading font-bold text-[11px] sm:text-sm text-white group-hover:text-cyan-300 transition-colors leading-tight">Clients</div>
                  <div class="text-[9px] sm:text-[10px] text-slate-400 font-medium">Partnerships</div>
                </div>
              </a>

              <!-- Box 2: Sample Shorts -->
              <a href="#sample-shorts" class="glass-card p-2.5 sm:p-3.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all text-left group flex flex-col justify-between shadow-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-mobile-screen text-[11px] sm:text-xs"></i>
                  </div>
                  <i class="fa-solid fa-arrow-down text-[9px] sm:text-[10px] text-slate-500 group-hover:text-cyan-300 transition-colors"></i>
                </div>
                <div>
                  <div class="font-heading font-bold text-[11px] sm:text-sm text-white group-hover:text-cyan-300 transition-colors leading-tight">Sample Shorts</div>
                  <div class="text-[9px] sm:text-[10px] text-slate-400 font-medium">Short-Form</div>
                </div>
              </a>

              <!-- Box 3: Cinematics -->
              <a href="#cinematic-trailers" class="glass-card p-2.5 sm:p-3.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all text-left group flex flex-col justify-between shadow-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-clapperboard text-[11px] sm:text-xs"></i>
                  </div>
                  <i class="fa-solid fa-arrow-down text-[9px] sm:text-[10px] text-slate-500 group-hover:text-blue-300 transition-colors"></i>
                </div>
                <div>
                  <div class="font-heading font-bold text-[11px] sm:text-sm text-white group-hover:text-blue-300 transition-colors leading-tight">Cinematics</div>
                  <div class="text-[9px] sm:text-[10px] text-slate-400 font-medium">16:9 Cinema</div>
                </div>
              </a>

            </div>
          </div>

          <!-- Right side: TikTok card and featured video -->
          <div class="lg:col-span-5 flex flex-col justify-start w-full max-w-md sm:max-w-lg mx-auto lg:mx-0 space-y-6">
            
            <!-- 1. TikTok Channel Showcase Card -->
            <div class="relative group">
              <div class="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-35 group-hover:opacity-60 transition duration-700"></div>
              
              <div class="relative glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-2xl">
                <!-- TikTok Channel Landscape Image (Clickable) -->
                <a href="https://www.tiktok.com/@schmuck.ey" target="_blank" rel="noopener noreferrer" class="relative block w-full rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 group/img hover:border-cyan-400 transition-colors" title="Visit @schmuck.ey on TikTok">
                  <img src="assets/images/image01.jpg" alt="Schmuckey TikTok Channel" loading="eager" decoding="async" class="w-full h-auto object-contain block rounded-xl group-hover/img:scale-[1.02] transition-transform duration-300">
                </a>

                <!-- TikTok Channel Tag & Direct Link -->
                <div class="mt-3.5 px-1 flex items-center justify-between text-xs">
                  <a href="https://www.tiktok.com/@schmuck.ey" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 group/tt hover:opacity-90 transition-opacity">
                    <span class="w-7 h-7 rounded-lg bg-black/60 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover/tt:border-cyan-400 group-hover/tt:bg-cyan-950/60 transition-colors">
                      <i class="fa-brands fa-tiktok text-sm"></i>
                    </span>
                    <span class="font-mono text-cyan-300 font-bold group-hover/tt:underline flex items-center gap-1.5">
                      @schmuck.ey
                      <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400 group-hover/tt:text-cyan-300"></i>
                    </span>
                  </a>
                  <a href="https://www.tiktok.com/@schmuck.ey" target="_blank" rel="noopener noreferrer" class="text-[11px] text-slate-400 hover:text-cyan-300 font-medium transition-colors">
                    Visit TikTok &rarr;
                  </a>
                </div>
              </div>
            </div>

            <!-- 2. Featured Video Box: "who am i?" -->
            <div class="relative group">
              <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-lg opacity-35 group-hover:opacity-60 transition duration-700"></div>
              
              <div class="relative glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-2xl">
                <!-- Video Embed (16:9 Aspect Ratio) -->
                <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-inner">
                  <iframe 
                    src="https://www.youtube.com/embed/PvQh6Fe7b_g?rel=0&playsinline=1&enablejsapi=1" 
                    title="who am i? - Schmuckey" 
                    class="w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                  </iframe>
                </div>

                <!-- Video Info & YouTube Link -->
                <div class="mt-3.5 px-1 flex items-center justify-between text-xs">
                  <a href="https://youtu.be/PvQh6Fe7b_g" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 group/yt hover:opacity-90 transition-opacity">
                    <span class="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 group-hover/yt:border-red-400 group-hover/yt:bg-red-950/60 transition-colors">
                      <i class="fa-brands fa-youtube text-sm"></i>
                    </span>
                    <span class="font-heading font-bold text-white group-hover/yt:text-cyan-300 group-hover/yt:underline transition-colors flex items-center gap-1.5">
                      who am i?
                      <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400 group-hover/yt:text-cyan-300"></i>
                    </span>
                  </a>
                  <a href="https://youtu.be/PvQh6Fe7b_g" target="_blank" rel="noopener noreferrer" class="text-[11px] text-slate-400 hover:text-cyan-300 font-medium transition-colors">
                    Watch on YouTube &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- Bludan client partnership showcase -->
    <section id="bludan" class="py-20 border-t border-cyan-500/10 relative overflow-hidden">
      <div id="clients"></div>
      <div class="ambient-glow-blue top-[100px] left-[-150px]"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <!-- Section Header: Clients / Testimonials -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="font-heading font-black text-3xl sm:text-5xl text-white tracking-wide">
            CLIENTS / <span class="gradient-text">TESTIMONIALS</span>
          </h2>
          <p class="text-slate-300 text-base sm:text-lg mt-3 font-medium">
            Long-term partnerships and proven viral track record with top creators
          </p>
          <p class="text-slate-500 text-xs mt-1">
            Featured creator collaborations, high-retention storytelling, and performance results.
          </p>
        </div>

        <!-- Header & Channel Profile Card -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 mb-12 relative overflow-hidden">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <!-- Left: Client Profile Info -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div class="relative">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20 bg-slate-900 flex-shrink-0">
                  <img src="assets/images/bludan_avatar.jpg" alt="bludan YouTube Channel" loading="lazy" decoding="async" class="w-full h-full object-cover">
                </div>
                <div class="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-red-600 border-2 border-slate-950 flex items-center justify-center text-white text-xs shadow-md">
                  <i class="fa-brands fa-youtube"></i>
                </div>
              </div>

              <div class="space-y-1">
                <!-- Long term client badge -->
                <div class="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-1">
                  <span class="tracking-wider uppercase font-bold text-[11px]">LONG TERM CLIENT</span>
                </div>
                <h3 class="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
                  <span class="gradient-text">bludan</span>
                </h3>
                <div class="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 font-medium pt-0.5">
                  <i class="fa-brands fa-youtube text-red-500 text-sm"></i>
                  <a href="https://www.youtube.com/@bludan1" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300 transition-colors font-mono font-semibold">@bludan1</a>
                  <span>&bull;</span>
                  <span>YouTube Creator</span>
                </div>
              </div>
            </div>

            <!-- Right: Performance Metrics & Channel Link -->
            <div class="grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-center gap-2.5 sm:gap-3 w-full lg:w-auto">
              <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-center min-w-[100px] sm:min-w-[110px]">
                <div class="font-heading font-black text-xl sm:text-2xl text-cyan-400">14M+</div>
                <div class="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Views Driven</div>
              </div>
              <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-center min-w-[100px] sm:min-w-[110px]">
                <div class="font-heading font-black text-xl sm:text-2xl text-amber-400">2.4M</div>
                <div class="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Top Video</div>
              </div>
              <a href="https://www.youtube.com/@bludan1" target="_blank" rel="noopener noreferrer" class="col-span-2 gradient-btn px-5 py-3 sm:py-3.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow-lg hover:shadow-cyan-500/30 transition-all w-full sm:w-auto min-w-[140px] justify-center">
                <i class="fa-brands fa-youtube text-base"></i>
                <span>@bludan1</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>

          </div>
        </div>

        <!-- Top 5 Highest-Viewed Videos Subheader -->
        <div class="text-center max-w-2xl mx-auto mb-8">
          <h3 class="font-heading font-black text-xl sm:text-2xl text-white uppercase tracking-wide">
            Top 5 Highest-Viewed <span class="gradient-text">Edits</span>
          </h3>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Over 9.1 million views generated across these top 5 featured storytelling roblox shorts.
          </p>
        </div>

        <!-- Top 5 Videos Grid (Portrait 9:16) -->
        <div class="auto-center-grid">

          <!-- 1. He Was So Brave (2.4M) -->
          <div class="auto-center-item glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/bludan_top1.jpg" alt="He Was So Brave" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              
              <div class="absolute top-3 inset-x-3 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-black shadow-lg flex items-center gap-1">
                  <i class="fa-solid fa-fire text-[10px]"></i> 2.4M Views
                </span>
                <span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  #1
                </span>
              </div>

              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="J6cNaCOeuaA"
                data-title="bludan - He Was So Brave (2.4M Views)"
                data-orientation="portrait"
                aria-label="Play video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>

              <div class="absolute bottom-3 inset-x-3 text-left">
                <h4 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  He Was So Brave 😢
                </h4>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                  <i class="fa-brands fa-youtube text-red-500"></i> @bludan1
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Viral Story Edit</span>
              <span class="text-amber-400 font-bold">2.4M Views</span>
            </div>
          </div>

          <!-- 2. He Saved Her Life (2.4M) -->
          <div class="auto-center-item glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/bludan_top2.jpg" alt="He Saved Her Life" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              
              <div class="absolute top-3 inset-x-3 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-black shadow-lg flex items-center gap-1">
                  <i class="fa-solid fa-fire text-[10px]"></i> 2.4M Views
                </span>
                <span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  #2
                </span>
              </div>

              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="O3GNtiAqfGE"
                data-title="bludan - He Saved Her Life (2.4M Views)"
                data-orientation="portrait"
                aria-label="Play video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>

              <div class="absolute bottom-3 inset-x-3 text-left">
                <h4 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  He Saved Her Life 😢
                </h4>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                  <i class="fa-brands fa-youtube text-red-500"></i> @bludan1
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Viral Story Edit</span>
              <span class="text-amber-400 font-bold">2.4M Views</span>
            </div>
          </div>

          <!-- 3. Rude Girl At The Cinema (1.7M) -->
          <div class="auto-center-item glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/bludan_top3.jpg" alt="Rude Girl At The Cinema" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              
              <div class="absolute top-3 inset-x-3 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-black shadow-lg flex items-center gap-1">
                  <i class="fa-solid fa-fire text-[10px]"></i> 1.7M Views
                </span>
                <span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  #3
                </span>
              </div>

              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="Mnnd3hpsvGs"
                data-title="bludan - Rude Girl At The Cinema (1.7M Views)"
                data-orientation="portrait"
                aria-label="Play video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>

              <div class="absolute bottom-3 inset-x-3 text-left">
                <h4 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  Rude Girl At The Cinema 😢
                </h4>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                  <i class="fa-brands fa-youtube text-red-500"></i> @bludan1
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Viral Story Edit</span>
              <span class="text-amber-400 font-bold">1.7M Views</span>
            </div>
          </div>

          <!-- 4. I Was So Scared Of Him (1.4M) -->
          <div class="auto-center-item glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/bludan_top4.jpg" alt="I Was So Scared Of Him" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              
              <div class="absolute top-3 inset-x-3 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-black shadow-lg flex items-center gap-1">
                  <i class="fa-solid fa-fire text-[10px]"></i> 1.4M Views
                </span>
                <span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  #4
                </span>
              </div>

              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="uWyhdtGFJaw"
                data-title="bludan - I Was So Scared Of Him (1.4M Views)"
                data-orientation="portrait"
                aria-label="Play video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>

              <div class="absolute bottom-3 inset-x-3 text-left">
                <h4 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  I Was So Scared Of Him 😢
                </h4>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                  <i class="fa-brands fa-youtube text-red-500"></i> @bludan1
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Viral Story Edit</span>
              <span class="text-amber-400 font-bold">1.4M Views</span>
            </div>
          </div>

          <!-- 5. He Sacrificed His Life For Her (1.2M) -->
          <div class="auto-center-item glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/bludan_top5.jpg" alt="He Sacrificed His Life For Her" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              
              <div class="absolute top-3 inset-x-3 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-black shadow-lg flex items-center gap-1">
                  <i class="fa-solid fa-fire text-[10px]"></i> 1.2M Views
                </span>
                <span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  #5
                </span>
              </div>

              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="M_nHo0ApiW4"
                data-title="bludan - He Sacrificed His Life For Her (1.2M Views)"
                data-orientation="portrait"
                aria-label="Play video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>

              <div class="absolute bottom-3 inset-x-3 text-left">
                <h4 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  He Sacrificed His Life For Her 😢
                </h4>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                  <i class="fa-brands fa-youtube text-red-500"></i> @bludan1
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Viral Story Edit</span>
              <span class="text-amber-400 font-bold">1.2M Views</span>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Sample shorts (vertical 9:16 edits) -->
    <section id="sample-shorts" class="py-20 bg-slate-950/60 border-y border-cyan-500/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="font-heading font-black text-3xl sm:text-5xl text-white tracking-wide uppercase">
            SAMPLE <span class="gradient-text">SHORTS</span>
          </h2>
          <p class="text-slate-300 textd-base sm:text-lg mt-3 font-medium">
            Sample edits that are done in different styles <span class="text-cyan-400 font-semibold">(Audio Recommended)</span>
          </p>
          <p class="text-slate-500 text-xs mt-1">
            Click any video below to watch the preview.
          </p>
        </div>

        <!-- Portrait Grid (5 items) -->
        <div class="auto-center-grid">

          <!-- 1. ZZZ OFFICE IN REAL LIFE (chiken) -->
          <div class="auto-center-item portfolio-item portrait-item yt-shorts glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/video02_thumbnail.jpg" alt="YT: Chiken - ZZZ Studio Transformation Teaser" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 backdrop-blur-sm">
                Clip
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-video-src="https://drive.google.com/file/d/1n-6xJStEpPRO9C3MDCyHOAR5Yp71ZRbV/preview"
                data-title="Sample Shorts for YouTuber: chiken (ZZZ OFFICE IN REAL LIFE)"
                data-orientation="portrait"
                aria-label="Play portrait video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>
              <div class="absolute bottom-3 inset-x-3 text-left">
                <h3 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  ZZZ Office in Real Life
                </h3>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5">
                  <i class="fa-solid fa-volume-high mr-1"></i>chiken
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400">
              Long-form video repurposed for Shorts (YT Chiken).
            </div>
          </div>

          <!-- 2. 200 DAYS IN WUTHERING WAVES (chiken) -->
          <div class="auto-center-item portfolio-item portrait-item yt-shorts glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/video03_thumbnail.jpg" alt="YT: Chiken - 200 Days in Wuthering Waves" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 backdrop-blur-sm">
                Clip
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-video-src="https://drive.google.com/file/d/1crwN0Uk3l9Vd0k3rFkE71TNtB87YGyzA/preview"
                data-title="Sample Shorts for YouTuber: chiken (200 days in wuthering waves)"
                data-orientation="portrait"
                aria-label="Play portrait video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>
              <div class="absolute bottom-3 inset-x-3 text-left">
                <h3 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  200 Days in Wuthering Waves
                </h3>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5">
                  <i class="fa-solid fa-volume-high mr-1"></i>chiken
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400">
              Long-form video repurposed for Shorts (YT: Chiken).
            </div>
          </div>

          <!-- 3. KILL STREAK SNEAK PEAK -->
          <div class="auto-center-item portfolio-item portrait-item sneak-peaks glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/video06_thumbnail.jpg" alt="Kill Streak Sneak Peak" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 text-[10px] font-bold border border-blue-500/40 backdrop-blur-sm">
                Montage
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="kQ-gxWrE9_c"
                data-title="Kill Streak Sneak Peak"
                data-orientation="portrait"
                aria-label="Play portrait video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>
              <div class="absolute bottom-3 inset-x-3 text-left">
                <h3 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  Kill Streak Montage
                </h3>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5">
                  <i class="fa-brands fa-youtube mr-1"></i>schmuckey
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400">
              Promotional gameplay montage for Kill Streak (Roblox).
            </div>
          </div>

          <!-- 4. ANIME EXPEDITION SNEAK PEAK -->
          <div class="auto-center-item portfolio-item portrait-item sneak-peaks glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/video07_thumbnail.jpg" alt="Anime Expedition Sneak Peak" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 backdrop-blur-sm">
                Sneak Peak
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="5WQGywezZpk"
                data-title="Anime Expedition Sneak Peak"
                data-orientation="portrait"
                aria-label="Play portrait video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>
              <div class="absolute bottom-3 inset-x-3 text-left">
                <h3 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  Anime Expedition Sneak Peak
                </h3>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5">
                  <i class="fa-brands fa-youtube mr-1"></i>schmuckey
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400">
              Promotional sneak peak for Anime Expedition (Roblox).
            </div>
          </div>

          <!-- 5. UNFINISHED COMMENTARY EDIT -->
          <div class="auto-center-item portfolio-item portrait-item sneak-peaks glass-card rounded-2xl overflow-hidden border border-cyan-500/20 group flex flex-col hover:border-cyan-400/50 transition-all">
            <div class="relative aspect-[9/16] overflow-hidden bg-slate-950">
              <img src="assets/videos/video09_thumbnail.jpg" alt="Unfinished Commentary Edit - MHL Sneak Peak" loading="lazy" decoding="async" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40"></div>
              <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 text-[10px] font-bold border border-purple-500/40 backdrop-blur-sm">
                Commentary
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="mBLTFt19oUE"
                data-title="Unfinished Commentary Edit"
                data-orientation="portrait"
                aria-label="Play portrait video">
                <i class="fa-solid fa-play ml-0.5 text-base"></i>
              </button>
              <div class="absolute bottom-3 inset-x-3 text-left">
                <h3 class="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  Unfinished Commentary Edit
                </h3>
                <p class="text-[10px] text-cyan-400 font-semibold mt-0.5">
                  <i class="fa-brands fa-youtube mr-1"></i>schmuckey
                </p>
              </div>
            </div>
            <div class="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400">
              Personal commentary edit regarding corruption in the Philippines.
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Cinematic showcases and trailers (landscape 16:9 videos) -->
    <section id="cinematic-trailers" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-4xl mx-auto mb-12">
          <h2 class="font-heading font-black text-3xl sm:text-5xl text-white uppercase">CINEMATIC SHOWCASE & <span class="gradient-text">TRAILERS</span></h2>
          <p class="text-slate-400 text-sm sm:text-base mt-2">
            Landscape format cinematic videos featuring immersive camera choreography and music sync.
          </p>
        </div>

        <div class="auto-center-grid-2">

          <!-- Landscape 1: Western Map Showcase -->
          <div class="auto-center-item-2 portfolio-item landscape-item trailers glass-card rounded-2xl overflow-hidden border border-cyan-500/30 group flex flex-col">
            <div class="relative aspect-video overflow-hidden bg-slate-950">
              <img src="assets/videos/video08_thumbnail.jpg" alt="Western Map Showcase" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-950/80 text-blue-300 text-[10px] font-bold border border-blue-500/40 backdrop-blur-sm">
                Cinematic
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="CMY3HQTyT68"
                data-title="Western Map Cinematic Showcase"
                data-orientation="landscape"
                aria-label="Play landscape video">
                <i class="fa-solid fa-play ml-1 text-xl"></i>
              </button>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 class="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-cyan-300 transition-colors">
                  Western Map Cinematic Showcase
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Cinematic Showcase for a Western Map created by Koolificso.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span class="text-cyan-400 font-semibold"><i class="fa-brands fa-youtube mr-1.5"></i>schmuckey</span>
                <span>Roblox Showcase</span>
              </div>
            </div>
          </div>

          <!-- Landscape 2: Anime Universe Mini-Trailer -->
          <div class="auto-center-item-2 portfolio-item landscape-item trailers glass-card rounded-2xl overflow-hidden border border-cyan-500/30 group flex flex-col">
            <div class="relative aspect-video overflow-hidden bg-slate-950">
              <img src="assets/videos/video05_thumbnail.jpg" alt="Anime Universe Mini-Trailer" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 backdrop-blur-sm">
                Trailer
              </span>
              <button 
                class="play-video-trigger absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                data-youtube-id="5s0ukwYrSE8"
                data-title="Anime Universe Mini-Trailer"
                data-orientation="landscape"
                aria-label="Play landscape video">
                <i class="fa-solid fa-play ml-1 text-xl"></i>
              </button>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 class="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-cyan-300 transition-colors">
                  Anime Universe Mini-Trailer
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Mini-trailer made for an upcoming roblox game (Anime Universe).
                </p>
              </div>
              <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span class="text-cyan-400 font-semibold"><i class="fa-brands fa-youtube mr-1.5"></i>schmuckey</span>
                <span>Roblox Mini-Trailer</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Work with me CTA section -->
    <section class="py-20 relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative glass-card rounded-3xl p-6 sm:p-12 border border-cyan-500/40 text-center overflow-hidden">
          <div class="ambient-glow-cyan top-[-150px] right-[-100px]"></div>

          <span class="inline-block px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
            Partnership & Inquiry
          </span>

          <h2 class="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            WORK WITH <span class="gradient-text">ME!</span>
          </h2>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a href="contact.php" class="gradient-btn w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white shadow-xl flex items-center justify-center gap-3">
              <i class="fa-brands fa-discord text-lg"></i>
              <span>Contact Me</span>
            </a>
            <a href="https://schmuckey.carrd.co" target="_blank" rel="noopener noreferrer" class="gradient-outline-btn w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl text-sm font-semibold text-cyan-300 flex items-center justify-center gap-2">
              <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              <span>View Carrd Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer section -->
  <footer class="bg-slate-950 border-t border-slate-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 text-center md:text-left">
      <div class="flex items-center gap-3">
        <span class="font-heading font-black text-[24px] text-white lowercase">
          schmuck<span class="gradient-text">EY</span>
        </span>
        <span class="text-slate-600">&bull;</span>
        <span>Content Creator & Video Editor</span>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <a href="index.php" class="hover:text-cyan-300 transition-colors">Home</a>
        <a href="services.php" class="hover:text-cyan-300 transition-colors">Services</a>
        <a href="about.php" class="hover:text-cyan-300 transition-colors">About</a>
        <a href="contact.php" class="hover:text-cyan-300 transition-colors">Contact</a>
        <a href="https://schmuckey.carrd.co" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300 transition-colors">Carrd</a>
      </div>

      <div class="text-slate-500 flex flex-wrap items-center justify-center gap-3">
        <span>&copy; <span class="current-year"></span> Schmuckey. All rights reserved.</span>
      </div>
    </div>
  </footer>

  <!-- Video modal popup (auto-adjusts for portrait vs landscape) -->
  <div id="video-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-6 bg-[#030712]/95">
    <div class="video-modal-backdrop absolute inset-0 cursor-pointer" title="Click anywhere outside to close"></div>

    <!-- Floating Top-Right Close Button (Desktop Only) -->
    <button class="close-video-modal-btn hidden sm:flex absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-cyan-500 text-slate-300 hover:text-black border border-cyan-500/40 items-center justify-center shadow-xl transition-all cursor-pointer group" aria-label="Close modal" title="Close (Esc)">
      <i class="fa-solid fa-xmark text-xl pointer-events-none group-hover:rotate-90 transition-transform"></i>
    </button>

    <div id="modal-dialog" class="relative bg-slate-900 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl z-10 transition-all duration-200 modal-landscape">
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 gap-4">
        <div class="flex items-center gap-2.5 truncate">
          <span id="modal-video-badge" class="px-2 py-0.5 text-[10px] font-bold rounded border font-mono"></span>
          <h3 id="modal-video-title" class="font-heading font-bold text-white text-sm sm:text-base truncate">
            Video Showcase
          </h3>
        </div>
        <div class="flex items-center gap-2.5 flex-shrink-0">
          <a id="modal-external-link" href="#" target="_blank" rel="noopener noreferrer" class="hidden text-xs text-slate-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 transition-all hover:scale-105 flex items-center gap-1.5" title="Watch in Original Full Quality">
            <span class="text-[11px] font-medium hidden sm:inline">Original</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
          <button id="close-video-modal" class="close-video-modal-btn text-slate-400 hover:text-cyan-300 p-2 rounded-xl hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer" aria-label="Close modal">
            <i class="fa-solid fa-xmark text-xl pointer-events-none"></i>
          </button>
        </div>
      </div>
      <div id="modal-video-container" class="relative bg-black flex items-center justify-center overflow-hidden min-h-[220px]">
        <!-- Spinner while the video loads -->
        <div id="modal-video-spinner" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 z-0 transition-opacity duration-300">
          <div class="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
          <span class="text-[11px] font-mono text-cyan-300/80 tracking-widest uppercase">Loading HD Stream...</span>
        </div>
        <video id="modal-video-player" class="hidden relative z-10 w-full h-full bg-black" controls playsinline preload="auto"></video>
        <iframe id="modal-video-iframe" src="" class="relative z-10 w-full h-full opacity-0 transition-opacity duration-300" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
    </div>
  </div>

  <!-- Back to Top Button -->
  <button id="back-to-top" aria-label="Back to top" class="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40 flex items-center justify-center opacity-0 pointer-events-none transition-all shadow-lg">
    <i class="fa-solid fa-arrow-up text-sm"></i>
  </button>

  <!-- jQuery 3.7.1 -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <!-- Main Script -->
  <script src="js/main.js"></script>
</body>
</html>
