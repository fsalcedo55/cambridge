import { Disclosure } from "@headlessui/react"
import { CurrentLesson } from "./CurrentLesson"
import { UnitPanel } from "./UnitPanel"
import { LevelPanel } from "./LevelPanel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import autoAnimate from "@formkit/auto-animate"
import { AnimatePresence, motion, useIsPresent } from "framer-motion"
import React from "react"

interface CurriculumDisclosureProps {
  levelsArray: any
  admin: boolean
  studentId?: string
  edit?: boolean
  lessonCompletions: any
}

export function CurriculumDisclosure({
  levelsArray,
  admin,
  studentId,
  edit,
  lessonCompletions,
}: CurriculumDisclosureProps) {
  interface unitMapProps {
    unitPhoto: string
    unitTitle: string
    unitPublished: boolean
    unitNumber: number
    unitNumberOfLessons: number
    levelPublished: boolean
    currentLessonList: any
    isSelected: boolean
    unitId: string
  }

  function UnitMap({
    unitPhoto,
    unitTitle,
    unitPublished,
    unitNumber,
    unitNumberOfLessons,
    levelPublished,
    currentLessonList,
    isSelected,
    unitId,
  }: unitMapProps) {
    const router = useRouter()
    const isPresent = useIsPresent()

    const handleUnitChange = () => {
      const newQuery = { ...router.query }

      if (unitId == router.query.unit) {
        delete newQuery.unit
      } else {
        newQuery.unit = unitId
      }

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { scroll: false, shallow: true }
      )
    }

    const isOpen = router.query.unit == unitId

    return (
      <div
        className={
          isOpen
            ? "my-1 bg-neutral-50 border border-neutral-400 shadow rounded-2xl"
            : "my-1 bg-white border border-white hover:bg-neutral-50 hover:border-neutral-200 hover:shadow rounded-2xl"
        }
      >
        <div
          className="flex items-center justify-between pr-6 cursor-pointer"
          onClick={handleUnitChange}
        >
          <UnitPanel
            imageUrl={unitPhoto}
            title={unitTitle}
            levelPublished={levelPublished}
            unitPublished={unitPublished}
            unitNumber={unitNumber}
            numberOfLessons={unitNumberOfLessons}
            admin={admin}
            edit={edit}
          />
        </div>
        {isOpen && isPresent && (
          <AnimatePresence>
            <motion.div
              key={unitId}
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 1000 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full px-6 pb-3 overflow-y-hidden shadow-inner rounded-2xl bg-gradient-to-l from-neutral-400 to-neutral-200 text-neutral-500"
            >
              <div className="h-4"></div>
              <CurrentLesson
                lessonList={currentLessonList}
                admin={admin}
                unitPublished={unitPublished}
                studentId={studentId}
                edit={edit}
                lessonCompletions={lessonCompletions}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }

  interface LevelMapProps {
    levelId: string
    levelNumber: number
    levelTitle: string
    levelPublished: boolean
    numberOfUnits: number
    publishedUnitsArray: []
    unitsArray: []
  }

  function LevelMap({
    levelId,
    levelNumber,
    levelTitle,
    levelPublished,
    numberOfUnits,
    publishedUnitsArray,
    unitsArray,
  }: LevelMapProps) {
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)

    const handleUnitSelect = (unitId: string) => {
      setSelectedUnitId(selectedUnitId === unitId ? null : unitId)
      // console.log("unitid: ", unitId)
    }
    // console.log("selectedUnitId: ", selectedUnitId)
    return (
      <div key={levelId} className="relative bg-white">
        <div id={`level-${levelNumber}-${levelId}`} className="bg-white">
          <LevelPanel
            levelNumber={levelNumber}
            levelTitle={levelTitle}
            levelPublished={levelPublished}
            levelObj={undefined}
            admin={admin}
            edit={edit}
            numberOfUnits={numberOfUnits}
            levelId={levelId}
          />
        </div>
        <ul role="list" className="relative z-0">
          {!admin &&
            publishedUnitsArray.map((currentUnit: any) => {
              const publishedLessons = currentUnit.Lesson.filter(
                (item: any) => item.published
              )
              return (
                <div key={currentUnit.id}>
                  <UnitMap
                    unitId={currentUnit.id}
                    unitPhoto={currentUnit.photoUrl}
                    unitTitle={currentUnit.title}
                    unitPublished={currentUnit.published}
                    unitNumber={currentUnit.number}
                    unitNumberOfLessons={publishedLessons.length}
                    levelPublished={levelPublished}
                    currentLessonList={currentUnit?.Lesson}
                    isSelected={selectedUnitId === currentUnit.id}
                  />
                </div>
              )
            })}
          {admin &&
            !edit &&
            publishedUnitsArray.map((currentUnit: any) => {
              const publishedLessons = currentUnit.Lesson.filter(
                (item: any) => item.published
              )
              return (
                <div key={currentUnit.id}>
                  <UnitMap
                    unitId={currentUnit.id}
                    unitPhoto={currentUnit.photoUrl}
                    unitTitle={currentUnit.title}
                    unitPublished={currentUnit.published}
                    unitNumber={currentUnit.number}
                    unitNumberOfLessons={publishedLessons.length}
                    levelPublished={levelPublished}
                    currentLessonList={currentUnit?.Lesson}
                    isSelected={selectedUnitId === currentUnit.id}
                  />
                </div>
              )
            })}
          {admin &&
            edit &&
            unitsArray?.map((currentUnit: any) => {
              const publishedLessons = currentUnit.Lesson.filter(
                (item: any) => item.published
              )
              return (
                <div key={currentUnit.id}>
                  <UnitMap
                    unitId={currentUnit.id}
                    unitPhoto={currentUnit.photoUrl}
                    unitTitle={currentUnit.title}
                    unitPublished={currentUnit.published}
                    unitNumber={currentUnit.number}
                    unitNumberOfLessons={currentUnit.Lesson.length}
                    levelPublished={levelPublished}
                    currentLessonList={currentUnit?.Lesson}
                    isSelected={selectedUnitId === currentUnit.id}
                  />
                </div>
              )
            })}
        </ul>
      </div>
    )
  }

  const publishedLevels = levelsArray.filter((level: any) => level.published)

  return (
    <nav
      className="h-full mt-3 bg-white border-8 border-white shadow-2xl rounded-3xl"
      aria-label="Directory"
    >
      {!admin &&
        levelsArray &&
        publishedLevels.map((level: any) => {
          const publishedUnits = level.Unit.filter(
            (uniqueUnit: any) => uniqueUnit.published
          )
          return (
            <div key={level.id}>
              <LevelMap
                levelId={level.id}
                levelNumber={level.number}
                levelTitle={level.title}
                levelPublished={level.published}
                numberOfUnits={level.Unit?.length}
                publishedUnitsArray={publishedUnits}
                unitsArray={level.Unit}
              />
            </div>
          )
        })}
      {admin &&
        levelsArray &&
        publishedLevels.map((level: any) => {
          const publishedUnits = level.Unit.filter(
            (uniqueUnit: any) => uniqueUnit.published
          )
          return (
            <div key={level.id}>
              <LevelMap
                levelId={level.id}
                levelNumber={level.number}
                levelTitle={level.title}
                levelPublished={level.published}
                numberOfUnits={level.Unit?.length}
                publishedUnitsArray={publishedUnits}
                unitsArray={level.Unit}
              />
            </div>
          )
        })}
    </nav>
  )
}
