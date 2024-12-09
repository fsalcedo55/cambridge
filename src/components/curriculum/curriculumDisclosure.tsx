import React, { useState, memo } from "react"
import { CurrentLesson } from "./CurrentLesson"
import { UnitPanel } from "./UnitPanel"
import { LevelPanel } from "./LevelPanel"
import { useRouter } from "next/router"
import { AnimatePresence, motion, useIsPresent } from "framer-motion"
import { Progress } from "../ui/progress"
import { trpc } from "@src/utils/trpc"

interface Lesson {
  id: string
  number: number
  photoUrl: string
  title: string
  slidesUrl: string
  objective: string
  assignments: {
    id: string
    title: string
    url: string
    lessonId: string
  }[]
  published: boolean
}

interface Unit {
  id: string
  photoUrl: string
  title: string
  published: boolean
  number: number
  Lesson: Lesson[]
}

export interface Level {
  id: string
  number: number
  title: string
  published: boolean
  Unit: Unit[]
}

interface CurriculumDisclosureProps {
  levelsArray: Level[]
  admin: boolean
  studentId?: string
  edit?: boolean
  lessonCompletions: Record<string, boolean>
}

const CurriculumDisclosure = memo(
  ({
    levelsArray,
    admin,
    studentId,
    edit,
    lessonCompletions,
  }: CurriculumDisclosureProps) => {
    interface unitMapProps {
      unitPhoto: string
      unitTitle: string
      unitPublished: boolean
      unitNumber: number
      unitNumberOfLessons: number
      levelPublished: boolean
      currentLessonList: Lesson[]
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
      unitId,
    }: unitMapProps) {
      const router = useRouter()
      const isPresent = useIsPresent()
      const numOfLessonsCompleted =
        trpc.unit.getCompletedLessonsPerUnit.useQuery<number>(
          {
            unitId,
            studentId: router.query.id as string,
          },
          {
            enabled: router.isReady,
          }
        )

      const handleUnitClick = () => {
        const newQuery = { ...router.query }

        if (unitId === router.query.unit) {
          delete newQuery.unit
        } else {
          newQuery.unit = unitId
        }

        const newUrl = {
          pathname: router.pathname,
          query: newQuery,
          hash: unitId,
        }

        router.push(newUrl, undefined, { scroll: false, shallow: true })
      }

      const isOpen = router.query.unit === unitId

      function percentage(completed: number, totalLessons: number) {
        if (totalLessons === 0) return 0

        const divided = completed / totalLessons
        return divided * 100
      }

      return (
        <div
          className={`scroll-target ${
            isOpen
              ? "my-1 bg-neutral-50 border border-neutral-400 shadow rounded-2xl"
              : "my-1 bg-white border border-white hover:bg-neutral-50 hover:border-neutral-200 hover:shadow rounded-2xl"
          }`}
          id={unitId}
        >
          <div
            onClick={handleUnitClick}
            className="flex items-center justify-between pr-6 cursor-pointer"
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
            <div className="w-60">
              <Progress
                value={
                  numOfLessonsCompleted.data !== undefined
                    ? percentage(
                        numOfLessonsCompleted.data,
                        unitNumberOfLessons
                      )
                    : 0
                }
              />
              <div className="flex justify-between py-1">
                <div className="font-bold text-neutral-500">
                  {numOfLessonsCompleted.data !== undefined
                    ? percentage(
                        numOfLessonsCompleted.data,
                        unitNumberOfLessons
                      )
                    : 0}
                  % Complete
                </div>
                <div className="text-neutral-400">
                  {numOfLessonsCompleted.data} of {unitNumberOfLessons}
                </div>
              </div>
            </div>
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
      publishedUnitsArray: Unit[]
      unitsArray: Unit[]
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
      const [selectedUnitId] = useState<string | null>(null)

      return (
        <div key={levelId} className="relative bg-white">
          <div className="bg-white">
            <LevelPanel
              levelNumber={levelNumber}
              levelTitle={levelTitle}
              levelPublished={levelPublished}
              admin={admin}
              edit={edit}
              numberOfUnits={numberOfUnits}
              levelId={levelId}
            />
          </div>
          <ul role="list" className="relative z-0">
            {!admin &&
              publishedUnitsArray.map((currentUnit: Unit) => {
                const publishedLessons = currentUnit.Lesson.filter(
                  (item: Lesson) => item.published
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
              publishedUnitsArray.map((currentUnit: Unit) => {
                const publishedLessons = currentUnit.Lesson.filter(
                  (item: Lesson) => item.published
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
              unitsArray?.map((currentUnit: Unit) => {
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

    const publishedLevels =
      levelsArray?.filter(
        (level): level is Level => level !== null && level.published
      ) ?? []

    return (
      <nav
        className="h-full mt-3 bg-white border-8 border-white shadow-2xl rounded-3xl"
        aria-label="Directory"
      >
        {!admin &&
          levelsArray &&
          publishedLevels.map((level: Level) => {
            const publishedUnits = level.Unit.filter(
              (uniqueUnit: Unit) => uniqueUnit.published
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
          publishedLevels.map((level: Level) => {
            const publishedUnits = level.Unit.filter(
              (uniqueUnit: Unit) => uniqueUnit.published
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
)

CurriculumDisclosure.displayName = "CurriculumDisclosure"

export default CurriculumDisclosure
