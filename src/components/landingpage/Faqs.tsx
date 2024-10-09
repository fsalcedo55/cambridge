import { Disclosure } from "@headlessui/react"
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline"

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
    question: "How do you ensure the safety of my child during online classes?",
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

export default function Faqs() {
  return (
    <div className="bg-white">
      <div className="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-4xl mx-auto divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="flex items-center ml-6 h-7">
                          {open ? (
                            <MinusSmallIcon
                              className="w-6 h-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="w-6 h-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="pr-12 mt-2">
                      <p className="text-base leading-7 text-gray-600 whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
