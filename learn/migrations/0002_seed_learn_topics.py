from django.db import migrations

TOPICS = [
    # --- pregnant ---
    {
        'stage': 'pregnant',
        'order': 1,
        'category': 'Birth Prep',
        'title': 'What to Expect in Labor',
        'summary': 'A gentle walk-through of the stages of labour, from early signs to meeting your baby.',
        'content': (
            "Labour is different for everyone, and there's no single \"normal\" way for it to unfold. "
            "But knowing roughly what to expect can make the whole experience feel a little less unknown.\n\n"
            "Labour usually begins with what's called the latent stage, where your cervix gradually softens "
            "and starts to open to make way for your baby. Contractions in this early phase tend to be "
            "irregular and can come and go over quite a stretch of time. For some people this passes "
            "quickly, for others it takes longer, and both are completely normal. This is often a good time "
            "to rest, stay hydrated, and keep moving gently if it feels comfortable.\n\n"
            "Once your contractions become stronger, closer together, and more regular, you're moving into "
            "established labour. Your cervix continues to open until it reaches full dilation, at which "
            "point your body is ready for the next stage. Many people find this stage the most intense, and "
            "it's exactly when the support of your birth partner, midwife, and whatever comfort measures "
            "you've planned for really come into their own, like breathing techniques, movement, a warm bath, or "
            "pain relief options you've discussed in advance.\n\n"
            "After full dilation comes the stage where you'll actively push your baby down and out into the "
            "world. How this feels and how long it takes varies enormously from person to person and birth "
            "to birth, so try not to hold yourself to any particular timeline you've read about. Your "
            "midwife will be guiding you throughout.\n\n"
            "Finally, there's a third stage after your baby arrives, where your womb contracts to deliver "
            "the placenta. Your midwife will talk you through your options for this, whether that's letting "
            "it happen naturally or with a little medical assistance.\n\n"
            "It's worth remembering that labour rarely goes exactly to plan, and that's okay. Your care "
            "team is there to help you make safe, informed decisions as things unfold, adjusting course if "
            "needed. Whatever your labour looks like, you don't have to know all the details in advance to "
            "get through it.\n\n"
            "If you have any questions about what to expect, or anything feels uncertain, please talk to "
            "your midwife or maternity team, since they know your pregnancy and can give you guidance specific "
            "to you."
        ),
    },
    {
        'stage': 'pregnant',
        'order': 2,
        'category': 'Birth Prep',
        'title': 'Preparing Your Hospital Bag',
        'summary': 'A simple checklist of what to pack for you and your baby, and when to have it ready.',
        'content': (
            "Packing your hospital bag is one of those small, practical tasks that can bring a lot of peace "
            "of mind, since it's one less thing to think about once labour starts. A good general guide is to "
            "have your bag ready a few weeks before your due date, since babies don't always stick to a "
            "schedule and can arrive earlier than expected.\n\n"
            "For yourself, it helps to pack loose, comfortable clothing to labour in, along with a couple of "
            "changes of clothes for afterwards. Nightwear that opens at the front is worth considering if "
            "you're planning to breastfeed. Bring underwear you don't mind replacing, maternity pads, and a "
            "toiletry bag with the basics, like a toothbrush, toothpaste, hairbrush, and anything that helps you "
            "feel a bit more like yourself. Many people also like to bring their phone charger, some snacks "
            "and drinks, and anything that helps you relax, like music or a pillow from home. If you and "
            "your midwife have discussed pain relief options such as a TENS machine, that's worth packing "
            "too. Don't forget your birth plan and any hospital notes you've been given.\n\n"
            "For your baby, pack a few outfits in a couple of different sizes. A bodysuit, a sleepsuit, and "
            "a hat are a good starting point, along with scratch mittens, socks, and a going-home outfit. "
            "Nappies, wipes or cotton wool, and a couple of muslin cloths are useful too. A blanket or shawl "
            "and a warm outfit are worth having on hand if the weather is cold. If you're driving home, "
            "you'll need a properly fitted baby car seat. This is essential, not optional, for the journey "
            "home.\n\n"
            "There's no need to pack for every possible scenario. Focus on the basics that will keep you and "
            "your baby comfortable, and know that the hospital will have plenty of support and supplies too "
            "if you've forgotten something.\n\n"
            "If you're unsure about anything specific to your birth plan or your hospital's own guidance, "
            "for example what facilities are available on the ward, it's worth asking your midwife or "
            "checking with your maternity unit directly."
        ),
    },
    {
        'stage': 'pregnant',
        'order': 3,
        'category': 'Birth Prep',
        'title': 'Understanding Your Birth Plan',
        'summary': "What a birth plan is, what to include, and why it's okay to stay flexible.",
        'content': (
            "A birth plan is simply a way of letting your midwife, nurses, and doctors know what matters to "
            "you during labour and birth. It's not a strict script for how things must go. Think of it more "
            "as a conversation starter, a way to share your preferences so your care team can support you as "
            "closely to your wishes as safely possible.\n\n"
            "There's no fixed template for what has to go in a birth plan, and you don't have to write one at "
            "all if you'd rather not, but if you do, it can help to think through a few key areas. Where "
            "would you like to give birth, if you have a choice, at home, in a midwifery-led unit, or in "
            "hospital? Who would you like with you, such as a partner, a family member, or a friend? What are "
            "your thoughts on pain relief, from breathing techniques and movement through to medical options? "
            "Are there particular positions, equipment like a birthing pool, or comfort measures that appeal "
            "to you? And do you have early thoughts on feeding your baby once they arrive?\n\n"
            "It's also worth writing down anything your midwife should know about you specifically, like "
            "previous birth experiences, anxieties you'd like extra support with, or anything that would "
            "help you feel more in control of the day.\n\n"
            "Perhaps the most important thing to hold onto is that birth doesn't always go exactly to plan, "
            "and that's completely normal. Sometimes circumstances change quickly, and decisions need to be "
            "made in the moment for your safety or your baby's. Having a birth plan doesn't mean everything "
            "has to happen exactly as written. It simply gives your care team a clear starting point for "
            "understanding what you want, so they can talk you through anything that needs to change along "
            "the way.\n\n"
            "You can update your birth plan at any point during your pregnancy, and you can change your mind "
            "about any part of it, even during labour itself. Your midwife is a great person to talk this "
            "through with, and they can help you put your thoughts into a plan that works for you.\n\n"
            "If you'd like help getting started, or have questions about what's realistic for your specific "
            "pregnancy, bring it up at your next appointment with your midwife or maternity team."
        ),
    },
    {
        'stage': 'pregnant',
        'order': 4,
        'category': 'Nutrition',
        'title': 'Nutrition During Pregnancy',
        'summary': 'General, reassuring guidance on eating well and foods to be mindful of while pregnant.',
        'content': (
            "Eating well during pregnancy doesn't mean following a special diet or eating for two. Your "
            "body's nutritional needs increase only a little, and a varied, balanced diet is usually the "
            "best foundation. Try to include a good mix of starchy foods like bread, rice, and potatoes, "
            "protein sources such as beans, eggs, fish, and lean meat, plenty of fruit and vegetables, and "
            "some dairy or calcium-rich alternatives. If your hunger or appetite changes throughout "
            "pregnancy, that's completely normal, so try to listen to your body rather than any strict "
            "rules.\n\n"
            "A folic acid supplement is recommended in pregnancy, alongside getting a good range of vitamins "
            "and minerals through food, so it's worth talking to your GP or midwife early on about the "
            "supplements that are right for you.\n\n"
            "There are also a few foods that are best avoided or limited while you're pregnant, mostly "
            "because of a small risk of infections like listeria, or because certain foods contain "
            "substances that aren't ideal in pregnancy. These include unpasteurised milk and certain soft, "
            "mould-ripened cheeses, raw or undercooked meat, pâté of any kind, and liver, which can contain "
            "high levels of vitamin A. It's also sensible to keep caffeine intake fairly low, and alcohol is "
            "best avoided altogether during pregnancy. Oily fish is great for you, but it's recommended to "
            "keep it to a couple of portions a week because of the pollutants it can contain, and some fish, "
            "like shark, swordfish, and marlin, are best avoided completely. Washing fruit and vegetables "
            "thoroughly is also a good habit, since soil can carry bacteria.\n\n"
            "It's easy to feel like there's a long list of things to worry about, but try not to let it take "
            "the joy out of mealtimes. Most foods are perfectly fine, and small slip-ups are nothing to be "
            "hard on yourself about. The goal is simply to feel your best and support your baby's "
            "development, one meal at a time.\n\n"
            "Every pregnancy is different, and some people have additional dietary needs or conditions, like "
            "gestational diabetes, that call for more specific guidance. If you have any questions "
            "about your diet, supplements, or a food you're unsure about, your GP or midwife is the best "
            "person to ask for advice tailored to you."
        ),
    },
    # --- postpartum ---
    {
        'stage': 'postpartum',
        'order': 1,
        'category': 'Mental Health',
        'title': 'Baby Blues vs. Postpartum Depression',
        'summary': 'Learn the difference between the common baby blues and postpartum depression, and when to reach out for support.',
        'content': (
            "In the days after having a baby, it's very common to feel a wave of emotions, from happiness to "
            "exhaustion to tearfulness and everything in between, sometimes all within the same hour. This is "
            "often called the \"baby blues,\" and it happens to many new mothers as your body adjusts to huge "
            "hormonal shifts, broken sleep, and the enormous change of caring for a newborn.\n\n"
            "The baby blues usually show up as feeling a bit down, anxious, or irritable, and for most people "
            "this passes within about two weeks of the birth. Even though it can feel intense in the moment, "
            "it doesn't usually get in the way of bonding with or caring for your baby, and it tends to ease "
            "on its own as your body and routine settle.\n\n"
            "Postpartum depression (also called postnatal depression) is different. It can start at any "
            "point, whether during pregnancy, soon after birth, or even later in the first year, and it tends to "
            "last longer and feel heavier than the baby blues. Instead of moments that come and go, you "
            "might notice a low mood that sticks around most of the time, feelings of hopelessness or that "
            "you can't cope, guilt or a sense that you're not a good enough parent, real difficulty sleeping "
            "even when you get the chance to rest, or finding it hard to feel connected to your baby.\n\n"
            "It's important to know that these feelings are not your fault, and they don't mean you're "
            "failing as a parent. Postpartum depression is a recognised health condition, not a character "
            "flaw, and it responds well to support.\n\n"
            "If any of this sounds familiar, even if you're only noticing some of these signs and not all of "
            "them, it's worth speaking to your GP, midwife, or health visitor. You don't need to wait until "
            "things feel unbearable, and you don't need a \"good enough\" reason. Reaching out is a good, "
            "brave step, not something to feel ashamed of, and it's exactly what these professionals are "
            "there for. They can help you figure out what you're experiencing and talk through the right "
            "kind of support for you.\n\n"
            "Only a healthcare professional can properly assess how you're feeling, so try not to "
            "self-diagnose based on a list like this one. It's simply here to help you notice what might be "
            "worth talking about. Whatever you're feeling right now, you deserve support, and it's always "
            "okay to ask for it."
        ),
    },
    {
        'stage': 'postpartum',
        'order': 2,
        'category': 'Feeding',
        'title': 'Feeding Basics (Breastfeeding and Formula)',
        'summary': 'A gentle introduction to breastfeeding and formula feeding, and how to prepare bottles safely.',
        'content': (
            "Feeding your newborn is one of the biggest parts of these early weeks, whether you're "
            "breastfeeding, formula feeding, or a mix of both, and there's no single \"right\" way to do it. "
            "What matters most is that your baby is fed and you're supported in whatever approach works for "
            "your family.\n\n"
            "If you're breastfeeding, it helps to let your baby feed as much as they want to in these early "
            "days, and that can mean very frequent feeds, at any hour of the day or night. This is completely "
            "normal newborn behaviour, not a sign that anything is wrong, and it's how your body learns how "
            "much milk to make. As your baby grows, feeds usually become a bit longer and further apart as "
            "they settle into more of a pattern.\n\n"
            "If you're formula feeding, your baby's stomach is still tiny, so they'll only need small "
            "amounts at each feed to begin with, gradually needing more as they grow. The exact amount for "
            "your baby's age and weight is best checked against the instructions on your formula packaging, "
            "or with guidance from your midwife or health visitor, since this can vary.\n\n"
            "However you're feeding, hygiene and safe preparation matter. If you're bottle feeding, it's best "
            "to make up each feed fresh, one at a time, rather than preparing several in advance. This helps "
            "reduce the risk of infection. Follow the instructions on the formula packaging closely, using "
            "the scoop provided and levelling it off, without adding extra powder. If there's any made-up "
            "formula left over after a feed, it's safest to throw it away rather than save it for later.\n\n"
            "It's also completely okay if feeding doesn't go exactly as you pictured. Plans often change, "
            "and switching between breastfeeding, combination feeding, or formula feeding based on what works "
            "for you and your baby is a normal part of this journey, not something to feel guilty about.\n\n"
            "If you're finding feeding painful, confusing, or worrying in any way, whether that's latch "
            "difficulties, low supply concerns, or questions about formula, your midwife, health visitor, "
            "or an infant feeding support service can offer hands-on guidance tailored to you and your baby. "
            "You don't have to figure this out alone."
        ),
    },
    {
        'stage': 'postpartum',
        'order': 3,
        'category': 'Newborn Care',
        'title': 'Getting Rest with a Newborn',
        'summary': 'Practical, realistic ways to protect your rest while caring for a newborn.',
        'content': (
            "If you feel exhausted right now, you are not doing anything wrong. Newborns wake often, need "
            "feeding around the clock, and often want to be held rather than settled alone, simply because "
            "they want to be close to you. It's completely normal for parents to feel worn out in these "
            "early weeks and months, and it does get easier as your baby grows and settles into longer "
            "stretches of sleep.\n\n"
            "One of the simplest, most repeated pieces of advice is to rest or sleep whenever your baby "
            "sleeps, rather than using that time to catch up on chores. It can feel counterintuitive to lie "
            "down when there's a pile of washing waiting, but your own rest matters just as much as "
            "everything else on the list, and often more, since it affects how you cope with everything "
            "else.\n\n"
            "It can also help to let go of non-essential jobs around the house for now. This is a short "
            "season, and the dishes or the tidying can wait. If you have a partner, friends, or family "
            "nearby, accepting or even actively asking for help, whether that's with a feed, a nappy change, "
            "watching the baby while you shower, or just having someone bring you food, is not a failure. "
            "It's one of the most sensible things you can do for yourself right now.\n\n"
            "Getting outside for some fresh air and daylight, even briefly, can also help both you and your "
            "baby. It's thought to help newborns gradually learn the difference between day and night, and a "
            "short walk can genuinely lift your mood when you're running on very little sleep.\n\n"
            "Try to eat regularly too, even if meals look different than they used to. A balanced diet, "
            "with fruit, vegetables, and enough water, supports your energy levels while your body is "
            "recovering and adjusting.\n\n"
            "If exhaustion is tipping into something that feels unmanageable, or you're finding it hard to "
            "cope generally, that's worth mentioning to your GP, midwife, or health visitor, since extreme "
            "tiredness can sometimes be tangled up with your mood or physical recovery, and they can help "
            "you find the right kind of support."
        ),
    },
    {
        'stage': 'postpartum',
        'order': 4,
        'category': 'Physical Health',
        'title': 'Physical Recovery After Birth',
        'summary': 'What to expect physically in the weeks after giving birth, and how to support your recovery.',
        'content': (
            "Your body has just done something enormous, and it needs time, care, and patience to recover, "
            "however you gave birth. It's completely normal for this recovery to take a while, and for your "
            "body to feel unfamiliar for a period after birth.\n\n"
            "If you have stitches, from a tear or an episiotomy, gently bathing the area every day can help "
            "prevent infection. A warm bath or shower with plain water, followed by carefully patting "
            "yourself dry, is usually recommended. Painkillers can help if there's soreness, and stitches "
            "are designed to dissolve on their own as the area heals, so you shouldn't need to have them "
            "removed.\n\n"
            "You'll also bleed from your vagina after birth. This is called lochia, and it's a normal part "
            "of your womb healing and returning to its pre-pregnancy state. It's often quite heavy to begin "
            "with, so having super-absorbent pads on hand helps, and over the following weeks it gradually "
            "becomes lighter and changes to a brownish colour before it stops.\n\n"
            "Eating well can support your body through this healing process, and plenty of fresh fruit, "
            "vegetables, wholegrains, and water all help. When it comes to movement, if you had a "
            "straightforward birth, gentle activity like walking or light stretching as soon as you feel "
            "ready can be a good place to start, alongside pelvic floor exercises, which are worth beginning "
            "early and continuing regularly.\n\n"
            "Try to be patient with your body and avoid comparing your recovery, or your shape, to anyone "
            "else's timeline. Recovery looks different for everyone, and a balanced diet combined with "
            "gentle movement, over time, tends to help your body gradually feel more like itself again.\n\n"
            "If you notice heavy bleeding that suddenly increases, signs of infection around any stitches, "
            "severe pain, or anything that worries you about your physical recovery, contact your GP or "
            "midwife promptly, since they're there to check in on you, not just the baby, and it's always okay "
            "to ask them about how you're healing."
        ),
    },
    # --- seasoned ---
    {
        'stage': 'seasoned',
        'order': 1,
        'category': 'Family Life',
        'title': 'Balancing Multiple Children',
        'summary': 'Simple, realistic ways to navigate the everyday juggling act of caring for more than one child at once.',
        'content': (
            "There's no getting around it. Caring for more than one child at a time is a different kind of "
            "busy. The juggling act of different ages, different needs, and different moods happening all at "
            "once can leave even the most experienced mother feeling stretched thin some days. If that's "
            "where you are right now, you are not doing anything wrong. This is simply what it looks "
            "like.\n\n"
            "One thing that tends to help is lowering the bar for what a \"good\" day looks like. With one "
            "child, you might have managed a full routine of activities, meals, and quality time. With more "
            "than one, some days will simply be about keeping everyone fed, safe, and reasonably happy, and "
            "that is enough. Perfection was never really the goal, even the first time around.\n\n"
            "It can also help to notice which moments genuinely need your full attention and which ones "
            "don't. Older children often don't need constant supervision the way a newborn does, and giving "
            "them small, safe responsibilities, like helping set the table, entertaining a younger sibling for a "
            "few minutes, or choosing their own outfit, can lighten your load while also helping them feel "
            "capable and included.\n\n"
            "Try, where you can, to carve out small pockets of one-on-one time with each child, even if it's "
            "just a few minutes at bedtime or in the car. Children don't need hours of undivided attention "
            "to feel seen; they need to know that, at some point in the day, they had you to themselves.\n\n"
            "And when siblings squabble, or one child seems to be struggling with sharing you, that's normal "
            "too, not a sign that you're failing to manage things. Adjusting to a bigger family is something "
            "everyone in the house is learning together, including you.\n\n"
            "Above all, be as kind to yourself as you would be to a friend juggling the same thing. Ask for "
            "help where you can get it, whether that's a partner, a family member, or a friend. Accepting "
            "support doesn't take anything away from how capable you are. You've already learned so much "
            "from the children you're raising; trust that you'll find your rhythm with this too, one day at "
            "a time."
        ),
    },
    {
        'stage': 'seasoned',
        'order': 2,
        'category': 'Mental Health',
        'title': 'Recognizing Your Own Needs',
        'summary': 'Why your own wellbeing still matters, and small ways to notice when you need a moment for yourself.',
        'content': (
            "When you've spent years caring for others, it's easy to lose touch with your own needs. You get "
            "so used to checking in on everyone else, asking whether they're fed, whether they're happy, "
            "whether they're okay, that checking in on yourself can start to feel like an afterthought, or "
            "even a little indulgent. It isn't. Your wellbeing matters just as much as it did before you "
            "became a mother, and noticing when you need something is not selfish. It's necessary.\n\n"
            "Recognizing your own needs starts with paying attention to the small signals: feeling unusually "
            "irritable, exhausted in a way that sleep doesn't seem to fix, or finding it hard to enjoy things "
            "you normally would. These aren't signs of failure. They're simply information, your body and "
            "mind letting you know that something needs attention.\n\n"
            "NHS guidance on mental wellbeing points out that making time for things that are just for you, "
            "like a hobby, learning something new, or simply time to relax, is a genuine, worthwhile way to "
            "support your mental wellbeing, not a luxury reserved for people with more free time. Even a "
            "small amount of time carved out regularly can make a real difference to how you feel.\n\n"
            "It can help to ask yourself, every so often: when did I last do something purely because I "
            "wanted to, not because someone needed me to? If the answer is \"I can't remember,\" that's a "
            "good sign it's time to make space for it, even in a small way, like a short walk alone, a phone "
            "call with a friend, or ten quiet minutes with a cup of tea.\n\n"
            "If you notice that things feel consistently heavy, not just a hard day here and there but a "
            "longer stretch where you're struggling to cope, it's worth talking to your GP. They can help "
            "you figure out what kind of support might help, whether that's someone to talk to, practical "
            "changes, or something else. Recognizing you need support is not a step backward; it's one of "
            "the most experienced, self-aware things you can do."
        ),
    },
    {
        'stage': 'seasoned',
        'order': 3,
        'category': 'Mental Health',
        'title': 'When to Seek Extra Support',
        'summary': 'How to tell the difference between an ordinary hard patch and a sign that it\'s time to reach out for help.',
        'content': (
            "Every parent has hard days, moments of feeling overwhelmed, short-tempered, or simply worn "
            "down. That's a normal part of family life, and it doesn't necessarily mean anything is wrong. "
            "But sometimes those hard days stretch into hard weeks, and it can be difficult to know where "
            "the line is between \"this is just a rough patch\" and \"this is something I should get help "
            "with.\"\n\n"
            "NHS guidance suggests it's worth seeing your GP if you're struggling to cope with stress, if "
            "things you've tried yourself aren't helping, or if you'd simply prefer some extra support and "
            "guidance. You don't need to wait until things feel unbearable before reaching out. GPs would "
            "much rather see you earlier than later.\n\n"
            "Some signs worth paying attention to include feeling persistently low, anxious, or exhausted in "
            "a way that doesn't lift with rest; struggling to enjoy things you normally would; finding it "
            "hard to keep up with everyday tasks; or noticing that stress is affecting your sleep, appetite, "
            "or relationships. None of these mean you're failing. They're signals that your current coping "
            "strategies might need some backup, which is a completely normal thing to need at any stage of "
            "motherhood.\n\n"
            "If things ever feel urgent, if you feel unable to cope or keep yourself safe, it's important "
            "to get help straight away, through emergency services, an urgent GP appointment, or a crisis "
            "line. If you are ever in crisis, please don't wait, and reach out for immediate help.\n\n"
            "Seeking support doesn't erase your experience or your capability as a mother. It adds to it. "
            "You've likely already learned, through everything you've navigated so far, that asking for help "
            "at the right time is what makes it possible to keep going well. Extending that same wisdom to "
            "your own mental health is simply the next step. Your GP, a support line, or a trusted mental "
            "health professional can help you figure out what kind of support fits what you're going through "
            "right now."
        ),
    },
    {
        'stage': 'seasoned',
        'order': 4,
        'category': 'Mental Health',
        'title': 'Managing Household Mental Load',
        'summary': "Understanding the invisible, ongoing organizational work of running a household, and why it's exhausting even when no one else notices.",
        'content': (
            "If you've ever felt exhausted at the end of a day where you didn't do anything especially "
            "physically demanding, you may be feeling the weight of what's often called the \"mental load.\" "
            "It's the constant, mostly invisible work of noticing, planning, and remembering everything a "
            "household needs, like knowing when the milk is about to run out, remembering a child's appointment, "
            "and anticipating what everyone will need before they ask for it. It rarely shows up on any to-do "
            "list, but it takes up real mental space, and it can be genuinely tiring.\n\n"
            "One of the hardest parts of the mental load is that it's easy for it to go unnoticed, even by "
            "the people closest to you, simply because so much of it happens silently, in your head, rather "
            "than as a visible task. That can make it feel lonelier than it should. Naming it, even just to "
            "yourself, can help. It isn't your imagination that keeping track of everything is tiring; it's "
            "a genuinely demanding kind of work.\n\n"
            "A few things can help lighten the load, even a little. Writing things down, like shared "
            "calendars, shopping lists, and reminders, moves information out of your head and into a shared "
            "space, so you're not the only one holding it. Where you can, try handing over full ownership of "
            "a task, not just the doing of it: instead of asking someone to \"help\" with something, letting "
            "them fully own planning and remembering it can genuinely take it off your plate, rather than "
            "adding a step of you still having to check on it.\n\n"
            "It's also worth saying clearly, to a partner or family member, what you're noticing. Most "
            "people aren't ignoring the mental load on purpose; they simply don't see it until it's pointed "
            "out. That conversation can feel awkward, but it's often the first step toward sharing it more "
            "evenly.\n\n"
            "If the weight of it all starts to feel like more than tiredness, if it's tipping into feeling "
            "constantly overwhelmed, anxious, or low, it's a good idea to talk to your GP or a mental health "
            "professional. You don't have to carry everything, in your house or in your head, entirely on "
            "your own."
        ),
    },
    # --- exploring ---
    {
        'stage': 'exploring',
        'order': 1,
        'category': 'Partner Support',
        'title': 'Supporting Someone Through Pregnancy',
        'summary': "Practical, everyday ways to be a steady, caring presence for someone going through pregnancy.",
        'content': (
            "Supporting someone through pregnancy doesn't require getting everything right. It mostly means "
            "showing up, staying curious, and being willing to adjust as things change. Pregnancy affects "
            "people differently, and what helps one day might not help the next, so checking in regularly "
            "matters more than having a fixed plan.\n\n"
            "Small lifestyle changes can go a long way. If you smoke, quitting protects both the pregnant "
            "person and the baby from the effects of secondhand smoke. Cutting back on or cutting out alcohol "
            "alongside them can also feel like solidarity rather than sacrifice. Joining them for gentle "
            "exercise, like walking or swimming, and eating well together are simple ways to support their "
            "health without making it feel like a chore they're doing alone.\n\n"
            "Going to antenatal classes and appointments together, when you can, helps you understand what's "
            "ahead and means you're not hearing important information secondhand. It also gives you a "
            "clearer sense of what to expect during labour and birth, so you can be a calmer, more informed "
            "presence when the time comes. Knowing the route to the hospital or birth centre in advance, and "
            "keeping midwife contact details handy, are small practical steps that can ease anxiety for both "
            "of you later on.\n\n"
            "There's also a quieter, less visible side to support: noticing when they're tired, overwhelmed, "
            "or need space, and responding without needing to be asked every time. Sorting out practical "
            "matters together, like understanding what leave, benefits, or financial supports you're "
            "entitled to, can lift a real weight off their shoulders and let them focus on the pregnancy "
            "itself.\n\n"
            "Once the baby arrives, your role shifts but doesn't shrink. If they're breastfeeding, bringing a "
            "glass of water or a snack during a feed is a small gesture that says you're paying attention. If "
            "the baby is bottle-fed, taking on sterilising bottles or preparing feeds means you're sharing "
            "the load from the very start, not just helping out.\n\n"
            "Above all, remember that support isn't about having answers. It's about being present, "
            "patient, and willing to learn alongside them. If you're ever unsure what they need, asking "
            "directly is almost always better than guessing. And if either of you has questions specific to "
            "their pregnancy, their midwife or GP is the right person to ask."
        ),
    },
    {
        'stage': 'exploring',
        'order': 2,
        'category': 'Partner Support',
        'title': 'How to Be There Without Overstepping',
        'summary': "Finding the balance between offering support and respecting someone's independence during this time.",
        'content': (
            "One of the hardest parts of supporting someone through pregnancy or new parenthood is knowing "
            "where the line is between helping and taking over. It's a natural instinct to want to fix "
            "things or do more, especially when you can see someone you care about is tired or struggling. "
            "But real support often looks less like taking charge and more like following their lead.\n\n"
            "A good starting point is simply asking rather than assuming. \"What would actually help right "
            "now?\" is a more useful question than deciding for them what they need. People's preferences can "
            "also change day to day. Someone might want company on one visit and quiet space the next, so "
            "it helps to check in each time rather than relying on what worked before.\n\n"
            "It's also worth paying attention to decisions that are really theirs to make: how they feed "
            "their baby, how they choose to recover, what parenting choices feel right for their family. Your "
            "role is to support those choices, not to steer them, even if you'd do things differently "
            "yourself. Offering an opinion is fine when it's asked for; offering it unprompted, repeatedly, "
            "can start to feel like pressure rather than care.\n\n"
            "Overstepping doesn't always look like giving unwanted advice. Sometimes it's showing up too "
            "often, staying too long, or filling every silence with suggestions. Learning to sit with "
            "someone without needing to solve anything can be one of the most valuable things you offer. "
            "Sometimes the most supportive thing you can do is simply be present, let them talk if they want "
            "to, and not need them to be okay for your own comfort.\n\n"
            "If you notice friction building, if your help is met with frustration rather than relief, "
            "it's worth gently asking whether you're getting the balance right, rather than assuming you "
            "already have it figured out. That kind of openness usually means more than getting everything "
            "perfect.\n\n"
            "Being there without overstepping is really about trust: trusting that they know what they "
            "need, and that your job is to listen for it, not to guess and push ahead regardless."
        ),
    },
    {
        'stage': 'exploring',
        'order': 3,
        'category': 'Mental Health',
        'title': 'Understanding Postpartum Changes',
        'summary': 'What changes to expect after birth, and how to recognise when someone might need extra support.',
        'content': (
            "The period after birth brings a huge amount of change, both physically and emotionally, and it "
            "can be hard to know from the outside what's a normal adjustment and what might need more "
            "support. Understanding a little about what's typical can help you be a steadier presence for "
            "the person you're supporting.\n\n"
            "Physically, recovery after birth takes time, and it looks different for everyone depending on "
            "how the birth went. It's common for new mothers to feel tired, sore, or simply not like "
            "themselves for a while. Being patient with a slower pace, and not expecting a quick \"bounce "
            "back,\" is one of the most helpful things you can do.\n\n"
            "Emotionally, it's very common for new mothers to experience what's often called the \"baby "
            "blues,\" feeling low, anxious, tearful, or overwhelmed in the days after birth. This is usually "
            "temporary and tends to ease within a couple of weeks as hormone levels settle. However, if low "
            "mood continues beyond that, gets worse, or she seems to be struggling to cope, it could be a "
            "sign of postnatal depression, which is different from the baby blues in that it doesn't just "
            "pass on its own with time.\n\n"
            "Signs worth paying attention to include a persistently low mood that doesn't lift, ongoing "
            "feelings of hopelessness or guilt, constant anxiety, difficulty concentrating, withdrawing from "
            "you or the baby, or seeming unable to enjoy things the way she used to. None of this means "
            "something has gone \"wrong\" with her as a parent. Postnatal depression is a recognised health "
            "condition, not a personal failing, and it can affect any new mother.\n\n"
            "If you notice these signs continuing, the most helpful thing you can do is gently encourage her "
            "to talk to her GP, midwife, or health visitor, since they're used to supporting people through "
            "exactly this, and there's no need to wait until things feel unmanageable. You don't have to "
            "diagnose anything yourself or have the right words figured out; simply saying you've noticed "
            "she seems to be finding things hard, and offering to help her make that call or go to that "
            "appointment, can make a real difference.\n\n"
            "Supporting someone through this stage means holding two things at once: giving the day-to-day "
            "changes time and patience, while staying alert to signs that professional support might help."
        ),
    },
    {
        'stage': 'exploring',
        'order': 4,
        'category': 'Practical Support',
        'title': 'Practical Ways to Help',
        'summary': 'Concrete, low-pressure ways to lighten the load for someone during pregnancy or early parenthood.',
        'content': (
            "When someone you care about is pregnant or newly caring for a baby, it's common to want to help "
            "but not know where to start. The good news is that some of the most valuable support is also "
            "the most practical, the kind that quietly takes something off their plate rather than adding "
            "another thing for them to manage or coordinate.\n\n"
            "Food is often a good place to begin. Bringing round a meal, stocking the fridge, or simply "
            "asking \"can I bring you dinner this week?\" removes a daily decision at a time when even small "
            "choices can feel like a lot. Offering to do a supermarket shop, or picking up specific items "
            "they mention needing, works the same way.\n\n"
            "Around the house, small tasks add up. Doing a load of laundry, tidying a room, taking out the "
            "bins, or handling something on their to-do list they haven't had the energy for can matter more "
            "than it seems. It's often more helpful to just do a task than to ask \"let me know if you need "
            "anything,\" since working out what to delegate can itself take energy they don't have spare.\n\n"
            "If a baby has already arrived, offering to hold or mind the baby for a short stretch, even "
            "just long enough for a shower, a nap, or a walk alone, can be one of the most meaningful things "
            "you offer. If they're bottle-feeding, helping sterilise equipment or prepare feeds is a concrete "
            "way to share the load. If they're breastfeeding, bringing water or a snack during a feed, or "
            "simply keeping them company, can help.\n\n"
            "Practical help with appointments counts too. Offering to drive, come along, or help remember "
            "questions to ask a midwife, GP, or health visitor can ease some of the mental load of pregnancy "
            "and early parenthood, which is often just as tiring as the physical side.\n\n"
            "Finally, one of the most practical things you can offer is simply asking directly, and being "
            "willing to hear \"no\" or \"not today.\" Support that adapts to what someone actually needs, "
            "rather than what feels good to give, tends to be the support that helps the most."
        ),
    },
]


def seed_topics(apps, schema_editor):
    LearnTopic = apps.get_model('learn', 'LearnTopic')
    for topic in TOPICS:
        LearnTopic.objects.get_or_create(
            stage=topic['stage'],
            title=topic['title'],
            defaults={
                'summary': topic['summary'],
                'content': topic['content'],
                'category': topic['category'],
                'order': topic['order'],
            },
        )


def remove_topics(apps, schema_editor):
    LearnTopic = apps.get_model('learn', 'LearnTopic')
    titles = [t['title'] for t in TOPICS]
    LearnTopic.objects.filter(title__in=titles).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('learn', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_topics, remove_topics),
    ]
