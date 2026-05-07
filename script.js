document.addEventListener("DOMContentLoaded",()=>{
// Theme
const html=document.documentElement;
const btn=document.getElementById("theme-toggle");
const saved=localStorage.getItem("portfolio-theme")||"dark";
html.setAttribute("data-theme",saved);
btn.addEventListener("click",()=>{
  const t=html.getAttribute("data-theme")==="dark"?"light":"dark";
  html.setAttribute("data-theme",t);
  localStorage.setItem("portfolio-theme",t);
  updateCharts(t);
});

// Mobile Menu
const mobileBtn=document.getElementById("mobile-menu-btn");
const mobileOverlay=document.getElementById("mobile-nav-overlay");
const mobileClose=document.getElementById("mobile-nav-close");
mobileBtn.addEventListener("click",()=>mobileOverlay.classList.add("open"));
mobileClose.addEventListener("click",()=>mobileOverlay.classList.remove("open"));
document.querySelectorAll(".mobile-nav-link").forEach(l=>l.addEventListener("click",()=>mobileOverlay.classList.remove("open")));

// FAB scroll collapse
const fab=document.getElementById("resume-fab");
window.addEventListener("scroll",()=>{
  if(window.scrollY>200){fab.classList.add("scrolled");}
  else{fab.classList.remove("scrolled");}
},{ passive:true });

// Custom Cursor
const dot=document.querySelector(".cursor-dot");
const ring=document.querySelector(".cursor-outline");
window.addEventListener("mousemove",e=>{
  dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";
  ring.animate({left:e.clientX+"px",top:e.clientY+"px"},{duration:400,fill:"forwards"});
});
document.querySelectorAll("a,button,.tl-body,.usp-card,.kpi-card,.contact-btn").forEach(el=>{
  el.addEventListener("mouseenter",()=>{ring.style.transform="translate(-50%,-50%) scale(1.5)";ring.style.background="rgba(180,83,9,0.06)";});
  el.addEventListener("mouseleave",()=>{ring.style.transform="translate(-50%,-50%) scale(1)";ring.style.background="transparent";});
});

// Reveal on scroll
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("active");
      // animate skill bars when revealed
      e.target.querySelectorAll(".fill").forEach(f=>{f.style.width=f.dataset.w+"%";});
      // animate KPI counters
      e.target.querySelectorAll(".kpi-num").forEach(n=>animateNum(n));
    }
  });
},{threshold:0.1,rootMargin:"0px 0px -40px 0px"});
document.querySelectorAll(".reveal").forEach(el=>revealObs.observe(el));

// KPI Counter animation
function animateNum(el){
  const target=+el.dataset.target;
  const dur=1600;const step=dur/60;
  let cur=0;
  const inc=target/60;
  const timer=setInterval(()=>{
    cur+=inc;
    if(cur>=target){cur=target;clearInterval(timer);}
    el.textContent=Math.floor(cur).toLocaleString();
  },step);
}

// Charts
const isDark=()=>document.documentElement.getAttribute("data-theme")==="dark";
const textColor=()=>isDark()?"#A8A29E":"#71717A";
const gridColor=()=>isDark()?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)";
const accentColor=()=>isDark()?"#F59E0B":"#B45309";
Chart.defaults.font.family="Outfit,sans-serif";

let cpaChart,growthChart,channelChart,autoChart;

function buildCharts(theme){
  const tc=textColor();const gc=gridColor();
  const opts={plugins:{legend:{labels:{color:tc,font:{size:12}}}},scales:{x:{ticks:{color:tc},grid:{color:gc}},y:{ticks:{color:tc},grid:{color:gc}}}};

  const ac=accentColor();
  // CPA Chart
  if(cpaChart)cpaChart.destroy();
  cpaChart=new Chart(document.getElementById("cpaChart"),{
    type:"bar",
    data:{labels:["최적화 전","최적화 후"],
      datasets:[{label:"상대 CPA 지수",data:[100,35],
        backgroundColor:[isDark()?"rgba(168,162,158,0.3)":"rgba(113,113,122,0.15)",ac],
        borderRadius:4,borderSkipped:false}]},
    options:{...opts,plugins:{...opts.plugins,tooltip:{callbacks:{label:c=>c.dataIndex===0?"기준 100%":"35% (65% 절감)"}}}},
  });

  // Growth Chart
  if(growthChart)growthChart.destroy();
  growthChart=new Chart(document.getElementById("growthChart"),{
    type:"bar",
    data:{labels:["SNS 광고 (SBS아카데미)","SNS 팔로워 (커커)","브랜드 매출 (프라브아)","월평균 KPI (SBS아카데미)"],
      datasets:[{label:"성장률 (%)",data:[1000,500,300,20],
        backgroundColor:[ac,ac+"CC",ac+"99",ac+"55"],
        borderRadius:3,borderSkipped:false}]},
    options:{...opts,indexAxis:"y"},
  });

  // Channel Chart
  const base=isDark()?"rgba(245,158,11,":"rgba(180,83,9,";
  if(channelChart)channelChart.destroy();
  channelChart=new Chart(document.getElementById("channelChart"),{
    type:"doughnut",
    data:{labels:["Meta Ads","Naver GFA","Kakao Moment","Google Ads","기타"],
      datasets:[{data:[35,25,20,15,5],
        backgroundColor:[base+"0.9)",base+"0.7)",base+"0.5)",base+"0.3)",isDark()?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.07)"],
        borderWidth:0,hoverOffset:8}]},
    options:{plugins:{legend:{position:"bottom",labels:{color:tc,padding:16,font:{size:11}}}},cutout:"70%"},
  });

  // Automation Chart
  if(autoChart)autoChart.destroy();
  autoChart=new Chart(document.getElementById("autoChart"),{
    type:"bar",
    data:{labels:["리포트 작업 (엑셀 VBA)"],
      datasets:[
        {label:"자동화 전 (분)",data:[60],backgroundColor:isDark()?"rgba(168,162,158,0.25)":"rgba(113,113,122,0.15)",borderRadius:3,borderSkipped:false},
        {label:"자동화 후 (분)",data:[20],backgroundColor:ac,borderRadius:3,borderSkipped:false}
      ]},
    options:{...opts,plugins:{...opts.plugins,title:{display:true,text:"업무 시간 66% 단축",color:tc,font:{size:11,weight:"700"}}}},
  });
}

function updateCharts(){setTimeout(()=>buildCharts(isDark()),300);}
buildCharts(isDark());
});
