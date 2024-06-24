# Logs, quotes, and feelings

## Logs

- 5/21 17:00 | Finally (sort of) created dev environment & (sort of) firgured out IBM cloud GUI. Interview tomorrow afternoon with 澎湖七美國中輔導老師。
- 6/3 19:30 | IBM's styling library is top tier dog shit，真的頂級難用。First of all, importing library into sass makes compile time increased to around 10 seconds. Furthermore, wrong order of import crashes the code. It also has the same problem with any other library -- limiting flexibility, which is fatal for a highly interactive program. I think the lesson is one library never fits all, and I'll just take some time molding the ui myself.
- 6/6 21:30 | More complaints. Styling is so stupid because CSS doesn't exactly follow the logic it was designed for.
- 6/8 19:00 | Building UI element is so much faster with Figma design. Most UI component is Reactified!
- 6/11 4:30 | Dang typescript is fancy.
- 6/11 23:40| So it all started when I decided to use typescript for better dev-x, then problems starts emerging. Turns out create-react-app is super outdated, and there are version conflicts with the newest version of typescript. There are workarounds, but I think our project is still in an early enough stage to chagne a build tool. I decided to go for Vite. The migration surprisingly does not take too long. However, setting up test seems to be non-trivial, and I installed a bunch of packages while failing to get testing to work. Its unlikly that we will need testing (for now), so I removed the test related artifacts from CRA and the packages I installed along the way, and I hope we'll have a clean start if we really get to the testing phase. Overall, tons of learning, a bit of frustration, but do have a working environment that I'm comfortable with.
- 6/12 23:46 | Wow, I really did wrote a lot yesterday. Thank god no one is reading this (or are you?). Anyways, not having testing properly set up, even when we're not doing testing, feels int. So today I re-did the testing set up, and it was faster than I expected. Other than that, more UI stuff, connected with Redux, tried out AI autocompletion tool, went through internal debate on how a component should be structured... and that's all for today.
- 6/13 20:30 | Learned more about redux and its terminologies due to me debating whether the current design pattern "can be better". I guess the question I should be asking is "is it good enough". Still, taking the time understanding redux basics is beneficial so I guess that's a "healthy enough" delay in work.
- 6/19 23:10 | Almost done with the base implementation of the two widgets... However, AI implementation still seems far from completed. At this pace, we probably have to push iteration 1 back by 1 week.
- 6/21 17:23 | I'm glad that stuff that I thought that needs to be refactored is actually better the original way. Learned how to write custom hooks today and solve the issue I wanted to solve without compromising scalability. For the most part (most) gui is completed for iteration 1. Besides certain widgets that needs to be thought out a bit more in terms of UX, the gui's data flow is implemented (without api), components are organized with reasonable scalability and performance. Still need a day or two to be fully done with the widgets, but Ellen and I can quickly be switching focus to the backend & ai.
- 6/24 23:15 | More API integration done... the code structure is fairly stable and extensible in my opinion. The only issue I have is there are certain blocks of logic that is repeated and scattered around gui, but probably going to be over-engineered if try to abstract them out. Perhaps this is the case where better ui will affect the code structure.

## Backlog

- Forms should be submitted when enter is pressed
  - Urgency: 1
- Header layout should be somewhat consistent even when classroom name changes
  - Urgency: 1
- Widget enter and exit animation
  - Urgency: 4
- ctrl+z and other key board shortcut (to reduce the need to confirm delete)
- Header layout is off when squashed
