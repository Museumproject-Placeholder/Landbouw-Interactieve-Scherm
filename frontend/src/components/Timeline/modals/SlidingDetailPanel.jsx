import React, { useEffect, useState } from "react"

const SlidingDetailPanel = ({
  isOpen,
  onClose,
  timelineItem,
  onOpenPuzzle,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) setShouldRender(true)
  }, [isOpen])

  // Unmount after exit transition
  useEffect(() => {
    if (!isOpen && shouldRender) {
      const t = setTimeout(() => setShouldRender(false), 250)
      return () => clearTimeout(t)
    }
  }, [isOpen, shouldRender])

  // ESC to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = e => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!shouldRender) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Panel: bottom sheet on mobile, right drawer on md+ */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeline-detail-title"
        className={[
          "fixed z-50 grid h-[75vh] w-full grid-rows-[auto,1fr] rounded-t-2xl bg-white shadow-2xl outline-none",
          "transition-transform duration-200 ease-out left-0 right-0 bottom-0",
          isOpen ? "translate-y-0" : "translate-y-full",
          // Desktop (md+): slide from right
          "md:top-0 md:bottom-0 md:left-auto md:right-0 md:h-full md:max-w-[34rem] md:rounded-none md:transition-transform md:duration-200 md:ease-out",
          isOpen ? "md:translate-x-0" : "md:translate-x-full",
          "touch-pan-y overscroll-contain",
        ].join(" ")}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-4 py-3 md:px-5">
          <h2
            id="timeline-detail-title"
            className="text-base font-semibold text-slate-900"
          >
            {timelineItem?.year
              ? `${timelineItem.year} — ${timelineItem?.title ?? ""}`
              : timelineItem?.title ?? "Details"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 overflow-y-auto px-4 pb-6 pt-3 md:px-5">
          {timelineItem && (
            <div className="space-y-4">
              {/* Optional hero image if available */}
              {timelineItem.puzzleImage && (
                <img
                  src={timelineItem.puzzleImage}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
              )}

              {timelineItem.description && (
                <p className="text-slate-700">{timelineItem.description}</p>
              )}

              {/* Puzzle CTA if available */}
              {timelineItem.hasPuzzle && typeof onOpenPuzzle === "function" && (
                <div>
                  <button
                    type="button"
                    onClick={onOpenPuzzle}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                  >
                    Play puzzle
                  </button>
                </div>
              )}

              {/* Example list of related objects; adapt if you add objects */}
              {Array.isArray(timelineItem.objects) &&
                timelineItem.objects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Related objects
                    </h3>
                    <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {timelineItem.objects.map(obj => (
                        <li
                          key={obj.id}
                          className="rounded-lg border p-2 hover:bg-slate-50"
                        >
                          {obj.thumb && (
                            <img
                              src={obj.thumb}
                              alt=""
                              loading="lazy"
                              className="mb-2 aspect-square w-full rounded object-cover"
                            />
                          )}
                          <div className="text-xs font-medium text-slate-800">
                            {obj.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default SlidingDetailPanel
