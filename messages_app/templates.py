MESSAGE_TEMPLATES = {
    'low_mood_checkin': [
        "Thank you for checking in today, even though it was a tough one. Your feelings are valid, and it's okay to have hard days.",
        "It sounds like today has been heavy. Be gentle with yourself — small steps still count.",
        "We see you. Some days feel harder than others, and just showing up here matters.",
    ],
    'sustained_low_mood': [
        "You've had a run of tough days lately. You don't have to carry this alone — it might help to talk to someone you trust.",
        "A stretch of low days can feel exhausting. Please be kind to yourself, and consider reaching out for extra support if you need it.",
        "We've noticed things have felt heavy for a while now. Reaching out to your GP or a support line is a good, brave step.",
    ],
    'low_sleep': [
        "Rest has been hard to come by lately. Even small moments of quiet can help your body recover.",
        "Sleep can be hard to come by right now. Try to rest when you can, even if it's just a short lie-down.",
        "Low sleep can make everything feel harder. Go easy on yourself today.",
    ],
    'after_journal': [
        "Thank you for taking the time to write. Putting feelings into words can be a real act of self-care.",
        "You showed up for yourself today by writing this down. That matters.",
        "Journaling is a lovely way to check in with yourself. Well done for taking the time.",
    ],
    'epds_elevated': [
        "Thank you for answering honestly. Your results suggest it could help to talk this through with your GP or midwife.",
        "You've taken a really positive step by completing this. Speaking with a healthcare professional about how you're feeling could help.",
        "However you're feeling, you don't have to manage this alone. Reaching out to your GP is a good next step.",
    ],
    'positive_checkin': [
        "It's lovely to hear you're having a good day. Enjoy it!",
        "So glad today feels good. Keep doing what's working for you.",
    ],
    # keyed by motherhood_stage — see messages_app/selector.py::get_daily_affirmation_message
    # for how 'seasoned' and 'exploring' fall back when there's nothing stage-specific to say
    'daily_affirmation': {
        'pregnant': [
            "Your body is doing something incredible. One day at a time.",
            "You are capable of getting through this pregnancy, one day at a time.",
            "It's okay to rest — growing a baby is already hard work.",
            "Whatever this pregnancy looks like for you, you are doing it well.",
            "You are already a wonderful parent, and your baby is lucky to have you.",
        ],
        'postpartum': [
            "You are doing better than you think. One day at a time.",
            "Being a mum is hard. You're doing it, and that matters.",
            "You are allowed to rest, to ask for help, and to be gentle with yourself today.",
            "Every small thing you do for your baby today counts, even the ones that feel invisible.",
            "You are learning as you go, and that is exactly how it's supposed to be.",
        ],
        'seasoned': [
            "Your experience matters — trust what you've learned along the way.",
            "It's okay to still have hard days, even as an experienced mum.",
            "You've grown so much through this journey, and that growth continues.",
            "Taking care of yourself is still just as important as it always was.",
            "You are allowed to ask for support, no matter how many times you've done this before.",
        ],
        'exploring': [
            "You are doing better than you think. One day at a time.",
            "Whatever today brings, you are enough for it.",
            "Small steps still count. Be proud of how far you've come.",
            "You are allowed to rest, to ask for help, and to be gentle with yourself today.",
            "Wherever you are on this journey, you deserve support and care.",
        ],
    },
    'love_bombing': [
        "You have gotten through every hard day so far. That is not nothing, that is everything.",
        "I know today feels heavy, but you are still here, still trying, still you. That takes real strength.",
        "You don't have to have it all figured out today. Just breathing through this moment is enough.",
        "Whatever this week has thrown at you, you're still standing. I'm proud of you for that.",
        "You are so much more than how you feel right now. This stretch will pass, and I'm right here with you until it does.",
    ],
}
