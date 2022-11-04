import { useState } from "react"

interface Props {
  title: string
  date: string
}

export default function LessonPlan({ title, date }: Props) {
  return (
    <div className="flex flex-col px-4 py-1 rounded-lg shadow bg-gradient-to-b from-[#f9fafb] border border-base-300">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-xs text-base-300">{date}</p>
      </div>
      <div className="h-2"></div>
      {/* Avatar and comment */}
      <div className="flex justify-start w-full gap-4 mb-2">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <img src="https://placeimg.com/192/192/people" />
          </div>
        </div>
        <div className="flex flex-col px-3 py-1 text-sm rounded-lg bg-base-200">
          <div className="flex items-center gap-2">
            <p className="font-bold">Elizabeth Tejeda</p>
            <div className="text-xs font-light opacity-60">Timestamp</div>
          </div>
          <p>Description of the class goes here</p>
        </div>
      </div>
    </div>
  )
}
