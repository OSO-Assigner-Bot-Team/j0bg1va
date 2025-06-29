# Soon ™️

## How to install and run:

#### Prerequisites:

install [Yarn](https://yarnpkg.com/) and [Docker](https://www.docker.com/)

then you simply run `yarn install`

#### For docker:
`yarn build`
`yarn up`

#### For node:
`yarn compile`
`yarn start`

## Desired Automaton Features:
- [ ] Claim job
- [ ] Finish job
- [ ] Create jobs
- [ ] Review job
- [ ] Fix Job in a wrong state (archived thread)
- [ ] Generate credits
- [ ] Drop assignment on ban
- [ ] Generate ads for available jobs
- [ ] Periodic reminders about deadlines
- [ ] Pass on background to next person on missed deadline
- [ ] Track writing credits
- [ ] VA auditions
- [ ] Process files after splits are made.
  
## Automaton Design:
- Discord integration
- SQlite for database (What ORM?)
- Google Spreadsheet to input output data. 
- Periodically sync database and spreadsheet (how often?)
- Jobs need to handle multiple types of jobs
	- Things that basic automaton will create a thread:
		- drawing: claim
		- backgrounds: claim
		- voice acting: assigned
		- audio prep: claim
		- audio engineering: claim
		- animation: claim
		- animation special bgs: claim (attached)
		- exporting: claim
		- editing: claim
		- credits: claim/staff
	- Track in a spreadsheet without a thread
		- staff: staff
		- head writers: voted/random
		- writing: special
		- storyboards: voted/random
		- voice director: voted
		- final editing: voted
		- animatics: staff 
- Jobs need stauses
	- Being Configured
	- Claimable
	- Missed deadline (Archive thread)
	- Dropped (Archive thread)
	- Being worked on 
	- Awaiting approval
	- Revision
	- Complete (Archive thread)
	- Credits (Set when not creating a thread)
- Separate tracking for writers 
- Separate tracking for VA auditions
- Periodically run function for reminders and ads
