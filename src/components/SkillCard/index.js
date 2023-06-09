import './index.css'

const SkillCard = props => {
  const {skillDetails} = props
  const {name, imageUrl} = skillDetails
  console.log(skillDetails)

  return (
    <li className="skill-list-items">
      <div className="skill-container">
        <img src={imageUrl} alt={name} className="skill-image" />
        <p className="image-name">{name}</p>
      </div>
    </li>
  )
}

export default SkillCard
