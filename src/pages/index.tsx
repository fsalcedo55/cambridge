// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GetServerSidePropsContext } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { getAuthSession } from "@src/server/common/get-server-session"
import HomeLandingPage from "@src/components/landingpage/HomeLandingPage"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Head from "next/head"
import type { FaqItem } from "@src/components/landingpage/Faqs"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)

  if (session?.role === "teacher") {
    return {
      redirect: { destination: "/teacher/students", permanent: false },
    }
  }
  if (session?.role === "admin") {
    return { redirect: { destination: "/admin/dashboard", permanent: false } }
  }
  if (session?.role === "parent") {
    return { redirect: { destination: "/parent/dashboard", permanent: false } }
  }

  const faqs = [
    {
      question: "What is Spanish For Us?",
      answer:
        "Spanish For Us is an online Spanish learning program specifically designed for children. We offer interactive and personalized lessons led by experienced native-speaking teachers, creating a fun and effective language learning environment for young learners.",
    },
    {
      question: "Who is the program for?",
      answer:
        "Our program is tailored for children aged 5 to 7 years and 8 years and older who are interested in learning Spanish as a second language. We adjust our lessons to suit the age and proficiency level of each student, ensuring an engaging and effective learning experience.",
    },
    {
      question: "How are the classes organized?",
      answer:
        "We offer three levels of learning: Beginner, Intermediate, and Advanced. Each level is designed to develop specific language skills, including listening comprehension, oral expression, reading comprehension, writing, vocabulary development, grammar, pronunciation, and phonetics.",
    },
    {
      question: "How many classes do children take per week?",
      answer:
        "Classes are available at flexible times to accommodate each family's schedule. Typically, we recommend 2 to 3 classes per week to ensure steady progress without overwhelming the child.",
    },
    {
      question: "What is the duration of each class?",
      answer:
        "Each class lasts 30 minutes, providing an optimal balance between maintaining the child's attention and delivering effective learning. This duration is ideal for young learners to stay engaged and absorb new information without feeling fatigued.",
    },
    {
      question: "Are the classes one-on-one or group sessions?",
      answer:
        "All our classes are one-on-one sessions. This personalized approach allows us to tailor each lesson to your child’s unique learning style and pace, ensuring the most effective and engaging learning experience.",
    },
    {
      question: "Who are the teachers?",
      answer:
        "Our teachers are native Spanish speakers with certifications in teaching languages to children. They are experienced in creating a stimulating and supportive learning environment that caters to each child's unique needs and learning style.",
    },
    {
      question: "What teaching methods do you use?",
      answer:
        "We employ interactive and playful teaching methods that include games, songs, artistic activities, and collaborative projects. Our personalized approach ensures that each child learns at their own pace and in a manner that suits their individual learning style.",
    },
    {
      question: "What topics and subjects are covered in the curriculum?",
      answer:
        "Our curriculum is comprehensive and covers a wide range of topics to ensure a well-rounded language education. Key subjects include:\n\n" +
        "• Vocabulary Development: Colors, numbers, animals, food, family, and daily activities.\n" +
        "• Grammar Fundamentals: Basic sentence structures, verb conjugations, and use of adjectives.\n" +
        "• Cultural Insights: Exploring Spanish-speaking countries, traditions, and holidays.\n" +
        "• Practical Communication: Everyday conversations, greetings, and expressing needs and preferences.\n" +
        "• Reading and Writing: From recognizing letters and simple words to forming complete sentences and short paragraphs.\n" +
        "• Pronunciation and Phonetics: Correct pronunciation of sounds and intonation patterns to build confidence in speaking.",
    },
    {
      question: "How can I enroll my child in Spanish For Us?",
      answer:
        'Enrolling your child is easy! Simply click on the "Get Started Free" button on our website and complete the registration form with the required information.',
    },
    {
      question: "Is there a trial period?",
      answer:
        "Yes, we offer a free class so that both you and your child can experience our teaching style and class structure before committing to a monthly plan.",
    },
    {
      question: "What do I need for my child to participate in the classes?",
      answer:
        "All you need is a computer or tablet with a stable internet connection, a webcam, and a microphone. Our classes are conducted entirely online, so no additional installations are required.",
    },
    {
      question:
        "How do you ensure the safety of my child during online classes?",
      answer:
        "Your child's safety is our top priority. All classes are held on secure platforms with access controls. Additionally, our teachers are trained to maintain a safe and respectful learning environment.",
    },
    {
      question: "How do you monitor my child's progress?",
      answer:
        "We conduct regular assessments through interactive activities and short quizzes to monitor each student's progress. Additionally, we provide monthly progress reports to keep you informed about your child's development.",
    },
    {
      question:
        "What should I do if I encounter technical issues during a class?",
      answer:
        "Our technical support team is available to assist you. You can reach us via email at spanishforuskids@gmail.com or by phone at (786) 588-4590 for immediate assistance.",
    },
    {
      question: "Do you provide additional learning materials?",
      answer:
        "Yes, we offer supplementary materials such as worksheets, interactive games, and digital resources that complement our lessons and reinforce learning at home.",
    },
  ]
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
      seoData: {
        title: "Spanish For Us - Online Spanish School for Kids",
        description:
          "Empower your child with interactive online Spanish classes. Personalized, engaging lessons led by native-speaking experts.",
      },
      faqs,
    },
  }
}

export default function IndexPage({
  seoData,
  faqs,
}: {
  seoData: { title: string; description: string }
  faqs: FaqItem[]
}) {
  const { data: session } = useSession()

  if (session) {
    // If session exists, the user will be redirected by getServerSideProps
    return null
  }

  return (
    <>
      <motion.nav
        className="sticky top-0 z-10 bg-white shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="container px-4 mx-auto"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between h-16">
            <Link href="/" legacyBehavior>
              <motion.a
                className="transition-transform duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/Spanish-For-Us-Logo-1080p (2).png"
                  alt="Spanish For Us Logo"
                  width={118}
                  height={36}
                  className="animate-fadeIn"
                />
              </motion.a>
            </Link>
            <div>
              <a
                href="https://tally.so/r/mRMq4l"
                rel="noopener noreferrer"
                target="_blank"
                className="flex px-5 py-2 font-bold rounded-full shadow-lg text-md bg-amber-400 text-primary-500 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Get Started <ArrowRightIcon className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.spanishforuskids.com" />
        <meta
          property="og:image"
          content="https://www.spanishforuskids.com/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta
          name="twitter:image"
          content="https://www.spanishforuskids.com/twitter-image.jpg"
        />
      </Head>
      <HomeLandingPage faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Spanish For Us",
            description: seoData.description,
            url: "https://www.spanishforuskids.com",
            sameAs: [
              "https://www.facebook.com/spanishforus",
              "https://www.instagram.com/spanishforus",
            ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "United States",
            },
          }),
        }}
      />
    </>
  )
}

IndexPage.auth = false
