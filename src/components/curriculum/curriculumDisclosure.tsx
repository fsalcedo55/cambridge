import { Disclosure } from "@headlessui/react"
import { MdDescription } from "react-icons/md"
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiPencilRulerLine,
  RiSlideshowLine,
} from "react-icons/ri"
import Image from "next/image"
import { SiBookstack } from "react-icons/si"
import Link from "next/link"
import { PublishedStatus } from "../ui/badges"

interface CurriculumDisclosureProps {
  levelsArray: any
  admin: boolean
  studentId?: string
}

export function CurriculumDisclosure({
  levelsArray,
  admin,
  studentId,
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
    return (
      <li className="bg-white hover:bg-neutral-50">
        <Disclosure>
          <Disclosure.Button
            as="div"
            className="flex items-center justify-between pr-6 cursor-pointer"
          >
            {
              <UnitPanel
                imageUrl={unitPhoto}
                title={unitTitle}
                levelPublished={levelPublished}
                unitPublished={unitPublished}
                unitNumber={unitNumber}
                numberOfLessons={unitNumberOfLessons}
                admin={admin}
              />
            }
          </Disclosure.Button>
          <Disclosure.Panel className="px-6 pb-3 shadow-inner bg-gradient-to-l from-neutral-400 to-neutral-200 text-neutral-500">
            <div className="h-4"></div>
            <CurrentLesson
              lessonList={currentLessonList}
              admin={admin}
              unitPublished={unitPublished}
              studentId={studentId}
            />
          </Disclosure.Panel>
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
      <div key={levelId} className="relative">
        {
          <LevelPanel
            levelNumber={levelNumber}
            levelTitle={levelTitle}
            levelPublished={levelPublished}
            levelObj={undefined}
            admin={admin}
            numberOfUnits={numberOfUnits}
            levelId={levelId}
          />
        }
        <ul role="list" className="relative z-0 divide-y divide-neutral-200">
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
    <nav className="h-full mt-3 overflow-y-auto" aria-label="Directory">
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
        levelsArray.levels.map((level: any) => {
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

interface CurrentLessonProps {
  lessonList: []
  admin: boolean
  unitPublished: boolean
  studentId?: string
}

export function CurrentLesson({
  lessonList,
  admin,
  unitPublished,
  studentId,
}: CurrentLessonProps) {
  interface LessonPanelProps {
    lessonNumber: number
    lessonId: string
    lessonPhoto: string
    lessonTitle: string
    lessonSlides: string
    lessonObjective: string
    lessonAssignments: any
    published: boolean
  }

  function LessonPanel({
    lessonNumber,
    lessonId,
    lessonPhoto,
    lessonTitle,
    lessonSlides,
    lessonObjective,
    lessonAssignments,
    published,
  }: LessonPanelProps) {
    return (
      <div className="relative flex items-center space-x-3">
        <div>
          <span className="inline-flex items-center justify-center w-12 h-12 p-2 text-2xl font-bold rounded-full bg-primary-800 text-primary-100">
            {lessonNumber}
          </span>
        </div>
        <Link
          href={
            admin
              ? `/admin/curriculum/${lessonId}`
              : `/admin/students/${studentId}/${lessonId}`
          }
        >
          <div className="flex justify-between flex-1 min-w-0 space-x-4">
            <div className="flex items-center min-w-full space-x-3 bg-white border-2 border-opacity-0 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-primary-500 hover:shadow-lg hover:cursor-pointer">
              <Image
                height={80}
                width={125}
                className="rounded-l"
                src={lessonPhoto}
                alt=""
              />
              <div className="flex items-center justify-between w-full pr-6">
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <p className="text-lg font-bold text-neutral-900">
                    {lessonTitle}
                  </p>
                  <div>
                    {admin && (
                      <PublishedStatus
                        published={published}
                        parentPublished={unitPublished}
                        draftedBy="Unit"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {lessonSlides ? (
                    <div className="flex flex-col items-center w-16 text-4xl opacity-80">
                      <RiSlideshowLine />
                      <div className="text-xs">Slides</div>
                    </div>
                  ) : null}
                  {lessonObjective ? (
                    <div className="flex flex-col items-center w-16 text-4xl opacity-80">
                      <MdDescription />
                      <div className="text-xs">Objective</div>
                    </div>
                  ) : null}
                  {lessonAssignments.length > 0 ? (
                    <div className="flex flex-col items-center w-16 text-4xl opacity-80">
                      <RiPencilRulerLine />
                      <div className="text-xs">Assignments</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  const lessonLine = (
    <span
      className="absolute top-12 left-6 -ml-px h-24 w-0.5 bg-primary-800"
      aria-hidden="true"
    />
  )
  const publishedLessons = lessonList.filter((lesson: any) => lesson.published)

  return (
    <div className="flex flex-col gap-3">
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {!admin &&
            publishedLessons.map((lesson: any, lessonIdx: number) => (
              <li key={lesson.id}>
                <div className="relative pb-8">
                  {lessonIdx !== publishedLessons.length - 1
                    ? lessonLine
                    : null}
                  <LessonPanel
                    lessonNumber={lesson.number}
                    lessonId={lesson.id}
                    lessonPhoto={lesson.photoUrl}
                    lessonTitle={lesson.title}
                    lessonSlides={lesson.slidesUrl}
                    lessonObjective={lesson.objective}
                    lessonAssignments={lesson.assignments}
                    published={lesson.published}
                  />
                </div>
              </li>
            ))}
          {admin &&
            lessonList.map((lesson: any, lessonIdx: number) => (
              <li key={lesson.id}>
                <div className="relative pb-8">
                  {lessonIdx !== lessonList.length - 1 ? lessonLine : null}
                  <LessonPanel
                    lessonNumber={lesson.number}
                    lessonId={lesson.id}
                    lessonPhoto={lesson.photoUrl}
                    lessonTitle={lesson.title}
                    lessonSlides={lesson.slidesUrl}
                    lessonObjective={lesson.objective}
                    lessonAssignments={lesson.assignments}
                    published={lesson.published}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

interface UnitPanelProps {
  imageUrl: string
  title: string
  levelPublished: boolean
  unitPublished: boolean
  unitNumber: number
  numberOfLessons: number
  admin: boolean
}

export function UnitPanel({
  imageUrl,
  title,
  levelPublished,
  unitPublished,
  unitNumber,
  numberOfLessons,
  admin,
}: UnitPanelProps) {
  return (
    <div className="relative flex items-center px-6 py-2 space-x-3 ">
      <Image
        height={120}
        width={175}
        src={imageUrl}
        alt=""
        className="rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <p className="text-2xl font-bold md:text-2xl text-primary-800">
            {title}
          </p>
          {admin && (
            <div>
              <PublishedStatus
                parentPublished={levelPublished}
                published={unitPublished}
                draftedBy={"Level"}
              />
            </div>
          )}
        </div>
        <p className="font-bold truncate text-neutral-500">Unit {unitNumber}</p>
        <div className="flex items-center gap-1 text-sm truncate text-neutral-500">
          <SiBookstack />
          <span>{numberOfLessons} Lessons</span>
        </div>
      </div>
    </div>
  )
}

interface LevelPanelProps {
  levelNumber: number
  levelTitle: string
  levelPublished: boolean
  levelObj: any
  numberOfUnits: number
  levelId: string
  editLevelModal?: () => void
  setStateOpenDisabledDeleteLevelModal?: () => void
  deleteLevelModal?: () => void
  admin: boolean
}

export function LevelPanel({
  levelNumber,
  levelTitle,
  levelPublished,
  numberOfUnits,
  editLevelModal,
  setStateOpenDisabledDeleteLevelModal,
  deleteLevelModal,
  admin,
}: LevelPanelProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-1 text-sm font-medium border-t border-b text-neutral-500 border-neutral-200 bg-primary-50">
      <div className="flex gap-2">
        <h3 className="text-xl font-bold text-primary-800">
          Level {levelNumber}: {levelTitle}
        </h3>

        {admin && (
          <div>
            <PublishedStatus published={levelPublished} />
          </div>
        )}
      </div>
      {admin && (
        <span className="inline-flex rounded-md shadow-sm isolate">
          <button
            onClick={editLevelModal}
            type="button"
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-l-full text-neutral-700 border-neutral-300 hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <RiPencilLine
              className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
              aria-hidden="true"
            />
            Edit
          </button>
          {admin && (
            <div>
              {numberOfUnits > 0 ? (
                <button
                  onClick={setStateOpenDisabledDeleteLevelModal}
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white border rounded-r-full hover:cursor-not-allowed text-neutral-700 border-neutral-300 focus:z-10 focus:border-danger-500 focus:outline-none focus:ring-1 focus:ring-danger-500"
                >
                  <RiDeleteBinLine
                    className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              ) : (
                <button
                  onClick={deleteLevelModal}
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white border rounded-r-full text-neutral-700 border-neutral-300 hover:bg-neutral-50 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <RiDeleteBinLine
                    className="w-5 h-5 mr-2 -ml-1 text-neutral-400"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              )}
            </div>
          )}
        </span>
      )}
    </div>
  )
}

interface UnitCrudTabsProps {
  editUnit: () => void
  numberOfLessons: number
  deleteUnitDisabled: () => void
  deleteUnit: () => void
}

export function UnitCrudTabs({
  editUnit,
  numberOfLessons,
  deleteUnitDisabled,
  deleteUnit,
}: UnitCrudTabsProps) {
  return (
    <span className="flex justify-end gap-3 pb-3 rounded-md isolate">
      <button
        onClick={editUnit}
        type="button"
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <RiPencilLine
          className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
          aria-hidden="true"
        />
        Edit Unit
      </button>

      {numberOfLessons > 0 ? (
        <button
          onClick={deleteUnitDisabled}
          type="button"
          className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-danger-500 focus:outline-none focus:ring-1 focus:ring-danger-500 hover:cursor-not-allowed"
        >
          <RiDeleteBinLine
            className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
            aria-hidden="true"
          />
          Delete Unit
        </button>
      ) : (
        <button
          onClick={deleteUnit}
          type="button"
          className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium bg-white hover:bg-neutral-50 rounded-b-xl text-neutral-700 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <RiDeleteBinLine
            className="w-5 h-5 mr-1 -ml-1 text-neutral-400"
            aria-hidden="true"
          />
          Delete Unit
        </button>
      )}
    </span>
  )
}

// const people = [
//   {
//     name: "Partes del Cuerpo",
//     completed: true,
//     imageUrl:
//       "https://images.unsplash.com/photo-1529155656340-c2c1cccb3dd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1725&q=80",
//   },
//   {
//     name: "Ropa de Invierno",
//     completed: false,
//     imageUrl:
//       "https://images.unsplash.com/photo-1613299469142-fa7d42740685?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1756&q=80",
//   },
// ]

// const curriculum = (
//   <div className="flex flex-col gap-4">
//     {people.map((person) => (
//       <div key={person.name} className="flex justify-between">
//         <div className="relative flex items-center min-w-full p-3 space-x-3 bg-white border rounded-lg shadow-sm border-neutral-100 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-neutral-400">
//           <div className="flex-shrink-0">
//             <Image
//               height={80}
//               width={125}
//               className="rounded"
//               src={person.imageUrl}
//               alt=""
//             />
//           </div>
//           <div className="flex-1 min-w-0">
//             <a href="#" className="focus:outline-none">
//               <span className="absolute inset-0" aria-hidden="true" />
//               <p className="text-lg font-bold text-neutral-900">
//                 {person.name}
//               </p>
//             </a>
//           </div>
//           {person.completed ? (
//             <div className="p-3 text-4xl text-green-500">
//               <RiCheckboxCircleFill />
//             </div>
//           ) : (
//             <div className="p-3 text-4xl text-neutral-500">
//               <RiCheckboxBlankCircleLine />
//             </div>
//           )}
//         </div>
//       </div>
//     ))}
//   </div>
// )

{
  /* 
        
        {levels &&
          levels?.data?.map((level) => (
            <div key={level.id} className="relative">
              <div className="sticky top-0 z-10 flex justify-between px-6 py-1 text-sm font-medium border-t border-b text-neutral-500 border-neutral-200 bg-primary-50">
                <h3 className="text-xl font-bold text-primary-800">
                  {level.title}
                </h3>
              </div>
              <ul
                role="list"
                className="relative z-0 divide-y divide-neutral-200"
              >
                {level.Unit.map((unit: any) => (
                  <li key={unit.id} className="bg-white hover:bg-neutral-50">
                    <Disclosure>
                      <Disclosure.Button
                        as="div"
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="relative flex items-center px-6 py-2 space-x-3 ">
                          <div className="flex-shrink-0">
                            <Image
                              height={120}
                              width={175}
                              src={unit.photoUrl}
                              alt=""
                              className="rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-2xl font-bold md:text-2xl text-primary-800">
                              {unit.title}
                            </p>
                            <p className="font-bold truncate text-neutral-500">
                              Unit {unit.number}
                            </p>
                            <div className="flex items-center gap-1 text-sm truncate text-neutral-500">
                              <SiBookstack />
                              <span>12 Lessons</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col px-8">
                          <span className="text-xs text-neutral-300">
                            Completed
                          </span>
                          <span className="text-3xl">56%</span>
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="p-6 bg-white text-neutral-500">
                         <div>{curriculumDisclosure(levels.data, false)}</div>
                      </Disclosure.Panel>
                    </Disclosure>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        
        */
}
