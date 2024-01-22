import { Disclosure } from "@headlessui/react"
import { CurrentLesson } from "./CurrentLesson"
import { UnitPanel } from "./UnitPanel"
import { LevelPanel } from "./LevelPanel"
import { useAutoAnimate } from "@formkit/auto-animate/react"

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
  }

  function UnitMap({
    unitPhoto,
    unitTitle,
    unitPublished,
    unitNumber,
    unitNumberOfLessons,
    levelPublished,
    currentLessonList,
  }: unitMapProps) {
    const [lessonPanelRef] = useAutoAnimate()
    return (
      <li className="my-1 bg-white hover:bg-neutral-50 rounded-2xl">
        <Disclosure>
          <Disclosure.Button
            as="div"
            className="flex items-center justify-between pr-6 cursor-pointer"
            id={`unit-${unitNumber}-${unitTitle}`}
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
          </Disclosure.Button>
          <div ref={lessonPanelRef}>
            <Disclosure.Panel className="h-full px-6 pb-3 overflow-y-hidden shadow-inner rounded-2xl bg-gradient-to-l from-neutral-400 to-neutral-200 text-neutral-500">
              <div className="h-4"></div>
              <CurrentLesson
                lessonList={currentLessonList}
                admin={admin}
                unitPublished={unitPublished}
                studentId={studentId}
                edit={edit}
                lessonCompletions={lessonCompletions}
              />
            </Disclosure.Panel>
          </div>
        </Disclosure>
      </li>
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
                    unitPhoto={currentUnit.photoUrl}
                    unitTitle={currentUnit.title}
                    unitPublished={currentUnit.published}
                    unitNumber={currentUnit.number}
                    unitNumberOfLessons={publishedLessons.length}
                    levelPublished={levelPublished}
                    currentLessonList={currentUnit?.Lesson}
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
                    unitPhoto={currentUnit.photoUrl}
                    unitTitle={currentUnit.title}
                    unitPublished={currentUnit.published}
                    unitNumber={currentUnit.number}
                    unitNumberOfLessons={publishedLessons.length}
                    levelPublished={levelPublished}
                    currentLessonList={currentUnit?.Lesson}
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
                    unitPhoto={currentUnit.photoUrl}
                    unitTitle={currentUnit.title}
                    unitPublished={currentUnit.published}
                    unitNumber={currentUnit.number}
                    unitNumberOfLessons={currentUnit.Lesson.length}
                    levelPublished={levelPublished}
                    currentLessonList={currentUnit?.Lesson}
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
