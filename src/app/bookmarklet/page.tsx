"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookmarkletPage() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const bookmarkletCode = `javascript:void(function(){var c='',r='',l=location.href,d=document;try{var s=d.querySelectorAll('h1');for(var i=0;i<s.length;i++){var t=s[i].innerText.trim();if(t.length>2&&t.length<200){r=t;break;}}var aa=d.querySelectorAll('a');for(var j=0;j<aa.length;j++){var a=aa[j];if(a.href&&a.href.indexOf('/company/')!==-1){var n=a.innerText.trim();if(n.length>1&&n.length<100){c=n;break;}}}if(!c){var m=d.querySelector('[class*="company-name"],[class*="topcard__org"]');if(m)c=m.innerText.trim();}}catch(e){}var u='${origin}/?company='+encodeURIComponent(c)+'&role='+encodeURIComponent(r)+'&job_link='+encodeURIComponent(l)+'&source=LinkedIn';window.open(u)||alert('Pop-up blocked! Allow pop-ups for linkedin.com, then try again.');}())`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            LinkedIn Bookmarklet
          </h1>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Save Jobs from LinkedIn in One Click
            </h2>
            <p className="text-slate-600">
              This bookmarklet lets you save any LinkedIn job listing to your
              tracker with one click. It grabs the company name, job title, and
              link automatically.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">
              Setup (30 seconds)
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="text-slate-700">
                    <strong>Show your bookmarks bar</strong> — press{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">
                      Ctrl+Shift+B
                    </kbd>{" "}
                    (Windows) or{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">
                      Cmd+Shift+B
                    </kbd>{" "}
                    (Mac)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="text-slate-700 mb-2">
                    <strong>Drag the button below</strong> to your bookmarks bar:
                  </p>
                  {origin && (
                    <a
                      href={bookmarkletCode}
                      onClick={(e) => e.preventDefault()}
                      className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition cursor-grab active:cursor-grabbing text-sm"
                    >
                      Save to Job Tracker
                    </a>
                  )}
                  {!origin && (
                    <div className="text-slate-400 text-sm">Loading...</div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Click and drag — don&apos;t just click it
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="text-slate-700">
                    <strong>Done!</strong> Now go to any LinkedIn job listing and
                    click &quot;Save to Job Tracker&quot; in your bookmarks bar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">
              How it works
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>
                &bull; Opens your Job Tracker with the company, role, and job link
                pre-filled
              </li>
              <li>&bull; Source is automatically set to &quot;LinkedIn&quot;</li>
              <li>
                &bull; You review the info, add any extras (comp, notes), and click
                &quot;Add Application&quot;
              </li>
              <li>
                &bull; Works on both LinkedIn job pages and job search results
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
