const axios = require('axios')
const express = require('express')
const app = express()
const token = process.env.TOKEN

const get_course = async (code) => {
  const cur_url = `https://importer.cs.helsinki.fi/course_unit_realisations?token=${token}&code=${code}&activityPeriodEndDateAfter=2019-12-15T11:53:00.521Z`
  const request = await axios.get(cur_url)
  const info = request.data[0]

  if ( !info ) {
    return {}
  }

  let groups = []
  if (info && info.studyGroupSets && info.studyGroupSets.find(s => s.name.en === "Exercise Group")) {
    groups = info.studyGroupSets.find(s => s.name.en === "Exercise Group")
    .studySubGroups
    .map(g => {
      return {
        name: g.name.fi,
        teachers: g.teacherIds
      }
    })
  }


  return{
    name: info.name,
    activity: info.activityPeriod,
    groups
  }
}

const main = async () => {
  await get_course("TKT20007")
}

// 500-K005
// 500-M009
// 500-M010
app.get('/courses/:code', async (req, res) => {
  const code = req.params.code 
  const courses_url = `https://importer.cs.helsinki.fi/course_units/programme/${code}?token=${token}`
  let request = await axios.get(courses_url)

  const courses = request.data.filter(c=>c.validityPeriod.startDate === '2020-08-01')
  const codes = courses.map(d=>d.code)
  
  const courseData = []
  for (let i= 0; i< codes.length; i++ ) {
    const course = await get_course(codes[i])
    courseData.push(course)
  }

  res.json(courseData)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
