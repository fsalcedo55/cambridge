import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import Faqs from "./Faqs"
import Footer from "./Footer"

export default function HomeLandingPage() {
  return (
    <div>
      <div className="relative bg-primary-500">
        <div className="mx-auto max-w-7xl">
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="object-cover w-full h-56 sm:h-72 md:h-96 lg:h-full lg:w-full"
              src="https://images.unsplash.com/photo-1611623516688-c47bb8d43311?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Spanish class for kids"
            />
          </div>
          <div className="px-6 py-12 sm:py-24 lg:w-1/2 xl:pr-16">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="text-xl font-black text-white mb-7">
                ONLINE SPANISH SCHOOL FOR KIDS
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-amber-400 sm:text-5xl md:text-6xl">
                ✨ Empower Your Child with Interactive Online Spanish Classes
              </h1>
              <p className="mt-6 text-lg font-light leading-8 sm:text-xl md:text-2xl text-white font-['Open_Sans']">
                Personalized, engaging Spanish lessons led by native-speaking
                experts. Boost skills, confidence, and a love for the language!
              </p>
              <div className="flex flex-col items-center mt-10 sm:flex-row gap-y-4 sm:gap-x-6">
                <a
                  href="https://tally.so/r/mRMq4l"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="w-full sm:w-auto text-center rounded-full bg-amber-400 px-3.5 py-2.5 text-sm sm:text-base font-extrabold text-primary-500 shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  Let's Begin With a Free Class
                </a>
                {/* <a href="#" className="font-semibold leading-6 text-primary-50">
                  Learn more <span aria-hidden="true">→</span>
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ********************** */}
      {/* <div className="relative bg-primary-500">
        <div className="mx-auto max-w-7xl">
          <div className="p-10 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <Image
              src="/landingPageAssets/hero-image.png"
              alt="Spanish class for kids"
              fill={true}
            />
          </div>

          <div className="px-6 py-12 sm:py-24 lg:w-1/2 xl:pr-16">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="text-xl font-black text-white mb-7">
                ONLINE SPANISH SCHOOL FOR KIDS
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-amber-400 sm:text-5xl md:text-6xl lg:text-7xl">
                ✨ Interactive Online Spanish Classes for Kids
              </h1>
              <p className="mt-6 text-lg font-light leading-8 sm:text-xl md:text-2xl text-white font-['Open_Sans']">
                Step into the vibrant world of Spanish with personalized online
                lessons led by experienced native-speaking teachers.{" "}
                <br className="hidden sm:inline" />
                Explore, learn, and embrace the language!
              </p>
              <div className="flex flex-col items-center mt-10 sm:flex-row gap-y-4 sm:gap-x-6">
                <a
                  href="https://tally.so/r/mRMq4l"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="w-full sm:w-auto text-center rounded-full bg-amber-400 px-3.5 py-2.5 text-sm sm:text-base font-extrabold text-primary-500 shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  Let's Begin With a Free Class
                </a>
                <a href="#" className="font-semibold leading-6 text-primary-50">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div> 
      </div>*/}
      <div className="bg-white">
        <HighlightsSection />
        <LearningJourneySection />
        <LevelsSection />
        <ParentsReviewSection />
        <Faqs />
        <Footer>
          <TrialClassButton text="Let's Get Started 🚀" />
        </Footer>
      </div>
    </div>
  )
}

function HighlightsSection() {
  const highlights = [
    {
      id: 1,
      name: "🌟 Personalized Learning Experience",
      description:
        "Dive into Spanish with lessons tailored just for your child. It's a personalized journey, enhancing learning in a way that's uniquely theirs.",
      image: "/landingPageAssets/Learning From Home_edited.webp",
    },
    {
      id: 2,
      name: "👩‍🏫 Experienced Native-Speaking Teachers",
      description:
        "Our experienced native instructors bring Spanish to life! Your child learns from the best, gaining a true grasp of the language.",
      image: "/landingPageAssets/Working Remotely_edited.webp",
    },
    {
      id: 3,
      name: "🚀 Interactive and Fun Lessons",
      description:
        "Learning Spanish? It's not just a lesson, it's an interactive, lively adventure! Engaging activities and games make every class a blast.",
      image: "/landingPageAssets/Distance_Learning_edited.jpg",
    },
  ]
  return (
    <div>
      <div className="py-16 bg-white sm:py-24">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <dl className="grid grid-cols-1 text-center gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="flex flex-col max-w-xs mx-auto gap-y-4"
              >
                <div className="relative mx-auto w-36 sm:w-48 h-36 sm:h-44">
                  <Image
                    src={highlight.image}
                    alt="logo"
                    fill={true}
                    className="object-contain"
                  />
                </div>

                <div className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  {highlight.name}
                </div>
                <div className="text-base font-light leading-7 text-gray-600 sm:text-xl">
                  {highlight.description}
                </div>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex justify-center mt-12 sm:mt-16">
          <TrialClassButton text="Claim Your Free Class" />
        </div>
      </div>
    </div>
  )
}

function LearningJourneySection() {
  return (
    <div className="relative w-full bg-white">
      <Image
        src="/landingPageAssets/divs/double-bubble.svg"
        alt="logo"
        width={1920}
        height={50}
        className="object-contain rotate-180"
      />
      <div className="flex flex-col items-center py-5 text-center bg-secondary-500">
        <div className="text-3xl font-black tracking-tight text-primary-500 sm:text-4xl md:text-5xl lg:text-6xl">
          Unveiling the Spanish Journey
        </div>
        <p className="mt-6 text-2xl font-thin leading-8 sm:text-4xl text-secondary-50">
          From Beginners to Mastery
        </p>
      </div>
      <Image
        src="/landingPageAssets/divs/arc-divider.svg"
        alt="logo"
        width={1920}
        height={50}
        className="object-contain"
      />
    </div>
  )
}

function LevelsSection() {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
        <LeftSideMascotLevelCard
          title="Beginners"
          subTitle="🌟 For Young Learners"
          description="Start the adventure! Our Beginners program is the first step, introducing young language enthusiasts to the beauty of Spanish. From essential vocabulary to pronunciation practice, your child's journey begins here, filled with interactive learning and a nurturing environment."
          mascotImage="/landingPageAssets/mascots/Untitled-1.png"
        />
      </div>
      <div className="relative">
        <Image
          src="/landingPageAssets/divs/slope-asymmetrical-divider.svg"
          alt="logo"
          width={1920}
          height={50}
          className="object-contain rotate-180"
        />
        <div className="bg-[#E1F1EA] flex items-center justify-center border-t-4 border-[#E1F1EA] py-12 sm:py-16">
          <div className="flex flex-col w-full px-4 sm:flex-row max-w-7xl sm:px-6 lg:px-8">
            <div className="flex-1 mb-8 sm:mb-0 sm:pr-8">
              <div className="relative max-w-2xl mx-auto sm:mx-0">
                <h1 className="mb-2 text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                  Intermediate
                </h1>
                <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">
                  🚀 Building Strong Foundations
                </h2>

                <p className="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg">
                  For those with a grasp of the basics, our Intermediate program
                  deepens language skills while exploring Spanish culture and
                  communication. Expand vocabulary, enhance conversational
                  skills, and foster both linguistic and cultural growth in this
                  dynamic learning experience.
                </p>

                <TrialClassButton text="Book a Free Class" />
              </div>
            </div>
            <div className="relative flex-1 h-64 sm:h-auto">
              <Image
                src="/landingPageAssets/mascots/Untitled-8.png"
                alt="spanish for us mascot"
                fill={true}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <Image
          src="/landingPageAssets/divs/slope-asymmetrical-divider.svg"
          alt="logo"
          width={1920}
          height={50}
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <LeftSideMascotLevelCard
          title="Advanced"
          subTitle="🔥 Mastering Spanish Fluency"
          description="Ready to achieve fluency? Our Advanced program refines language skills, covering advanced vocabulary, complex grammar, and expressive communication. Your child's language precision and confidence will soar in these high-level classes."
          mascotImage="/landingPageAssets/mascots/Untitled-1.png"
        />
      </div>
    </div>
  )
}

interface LevelCardProps {
  title: string
  subTitle: string
  description: string
  mascotImage: string
}

function LeftSideMascotLevelCard({
  title,
  subTitle,
  description,
  mascotImage,
}: LevelCardProps) {
  return (
    <div className="flex flex-col w-full px-4 sm:flex-row sm:w-4/5 sm:px-0">
      <div className="relative flex-1 h-64 mb-4 sm:h-96 sm:mb-0">
        <Image
          src={mascotImage}
          alt="spanish for us mascot"
          fill={true}
          className="object-contain"
        />
      </div>
      <div className="flex-1">
        <div className="relative max-w-2xl p-4 mx-auto sm:p-8">
          <div className="relative">
            <h1 className="mb-2 text-4xl font-extrabold text-black sm:text-6xl">
              {title}
            </h1>
            <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">
              {subTitle}
            </h2>

            <p className="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg">
              {description}
            </p>

            <TrialClassButton text="Book a Free Class" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ParentsReviewSection() {
  const reviews = [
    {
      text: "Spanish for Us is a wonderful program for kids to learn Spanish. My son's teacher is Carmen. She is very patient and makes the class a fun learning experience. The teacher keeps him engaged by changing the activities such us playing games, drawing and looking for items. My son has made progress since he started this program. Thank you Carmen and the Spanish for Us team for everything!",
      author: "Janely Garcia",
    },
    {
      text: "Spanish For Us has been amazing! I have seen improvement in my child's Spanish and a boost in confidence when speaking. Cristina is very responsive, understanding and professional. Ms. Eli is amazing with kids. She knows how to communicate with children and engage them in each lesson. Thank you for making this such a pleasant experience!",
      author: "Mariana Briones",
    },
    {
      text: "My daughter has been receiving Spanish lessons for over a year now and she has enjoyed herself immensely. Her teacher is professional, friendly, knowledgeable, and great with kids. My daughter looks forward to her Spanish lessons every week and we are thrilled to give her the opportunity to practice her skills with the guidance of a stellar tutoring company.",
      author: "Kelly Suarez",
    },
    {
      text: "My kids (ages 3 and 5) have been taking Spanish classes since July 2020. Initially I was hesitant since it was only offered as a virtual option but I have had only good experiences with Spanish for Us. She is very patient with them and engages them really well. My kids look forward to classes twice a week and have learned a lot. They went from knowing single words to actually saying sentences in Spanish.",
      author: "Maria S.",
    },
    {
      text: "My two daughters have been taking individual online classes via Zoom for several months now with Eli, one of the teachers of Spanish for Us. Both girls, seven and eleven years old, have shown tremendous progress in learning Spanish. Eli is a talented and patient teacher, very professional and adapts her classes to each child. The materials and topics selected for the lessons are very interesting to my daughters, and they love their classes with Eli. ",
      author: "Alla Stewart",
    },
    {
      text: "I was thrilled to find a Spanish class virtually for my girls. It's been so convenient with the crazy work, school and sport schedules. My experience with Spanish For Us has been great and the girls love Rebeca their teacher. Rebeca is very patient and kind in her teachings. Cristina is very responsive to communications which is appreciated when any changes are needed.",
      author: "Bessy Bonnell",
    },
    {
      text: "I have two young sons who were very hesitant to speak Spanish despite being in a Spanish friendly environment. Our eldest son was even getting in trouble in school because he was frustrated with being unable to follow the lessons. Our sessions with Eli Tejeda have really brought him a new level of confidence and he's now trying to have conversations and his attitude has improved significantly. She's been a god send.",
      author: "Henry Pinera",
    },
    {
      text: "My son has been taking Spanish courses with them for a year now. The teacher is incredible he loves her a lot. The software is nicely built for activities, songs … kids will not get bored they actually enjoy their Spanish classes. Best choice ever.",
      author: "Christiane Chbib",
    },
    {
      text: "Ever since my son started classes with Spanish For Us his Spanish has gotten so much better. He was afraid to even try it or speak it. Now, whenever he hears Spanish he tries to join in on the conversation. Ms. Paula is great, patient and very sweet.",
      author: "Roxana Macia",
    },
  ]

  return (
    <div>
      <div className="relative top-0 left-0 right-0 h-24 overflow-hidden sm:h-36">
        <Image
          src="/landingPageAssets/divs/parentReviewsTopDiv.svg"
          alt="wavy div"
          fill={true}
          className="object-cover object-bottom rotate-180"
        />
      </div>
      <div className="py-8 bg-primary-500">
        <div className="flex flex-col items-center justify-around w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-3xl font-black text-center text-white sm:text-4xl md:text-5xl sm:mb-12">
            Words From Parents
          </div>
          <div className="w-full max-w-4xl">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {reviews.map((review, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="flex flex-col p-4 rounded-xl bg-secondary-500 h-96">
                      <div className="flex justify-center mb-2 text-3xl">
                        ⭐️⭐️⭐️⭐️⭐️
                      </div>
                      <div className="flex flex-col justify-center flex-grow text-center">
                        <div className="text-sm text-secondary-900">
                          {review.text}
                        </div>
                      </div>
                      <div className="flex justify-center mt-2 font-bold text-secondary-900">
                        {review.author}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center w-full gap-2 py-4 mt-4">
                <CarouselPrevious className="static" />
                <CarouselNext className="static" />
              </div>
            </Carousel>
          </div>
        </div>
        <div className="flex justify-center my-5">
          <TrialClassButton text="Book a Free Class" />
        </div>
      </div>
      <div className="relative bottom-0 left-0 right-0 h-24 overflow-hidden sm:h-36">
        <Image
          src="/landingPageAssets/divs/ParentReviewsTopDiv.svg"
          alt="wavy div"
          fill={true}
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}

function TrialClassButton({ text }: { text: string }) {
  return (
    <a
      href="https://tally.so/r/mRMq4l"
      rel="noopener noreferrer"
      target="_blank"
      className="inline-block px-6 py-3 text-lg font-bold rounded-full shadow-lg sm:px-10 sm:py-4 sm:text-2xl bg-amber-400 text-primary-500 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
    >
      {text}
    </a>
  )
}
