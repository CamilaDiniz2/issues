import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaComment,
  FaGithub,
  FaShareSquare,
  FaUnlink,
} from 'react-icons/fa'
import { NavLink, useParams } from 'react-router-dom'
import {
  IssuePrincipalCardContainer,
  IssueCardInfo,
  IssueTitle,
  IssueSecondaryInfo,
  IssueContent,
  IssueNotFoundPage,
} from './styles'

interface IssueProps {
  number: number
  title: string
  body: string
  created_at: Date
  html_url?: string
  comments?: number
}

export function IssuePage() {
  const { id } = useParams()
  const [issue, setIssue] = useState<IssueProps>([])
  const [bodyContent, setBodyContent] = useState<string[]>([])
  const [dateToNow, setDateToNow] = useState<string>('')
  const [isIdNotFound, setIsIdNotFound] = useState(false)
  const username = 'camiladiniz2'
  const repositoryName = 'github-blog'

  async function loadIssue() {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repositoryName}/issues/${parseInt(
        id,
      )}`,
    )
    if (response.ok === false) {
      setIsIdNotFound(true)
    }
    const data = await response.json()

    const body = await data.body.split('\n')
    const formattedDate = await formatDistanceToNow(new Date(data.created_at), {
      locale: ptBR,
      addSuffix: true,
    })
    setIssue(data)
    setBodyContent(body)
    setDateToNow(formattedDate)
  }

  useEffect(() => {
    loadIssue()
  }, [])

  console.log(isIdNotFound)

  return (
    <IssuePrincipalCardContainer>
      {isIdNotFound && (
        <IssueNotFoundPage>
          <nav>
            <NavLink to="/">
              <FaChevronLeft />
              <span>Voltar</span>
            </NavLink>
          </nav>
          <FaUnlink size={54} />
          <h1>Issue not found</h1>
          <div>
            <p>Pease,</p>
            <p>Go back to homepage or try a valid issue id</p>
          </div>
        </IssueNotFoundPage>
      )}

      {!isIdNotFound && (
        <>
          <IssueCardInfo>
            <nav>
              <NavLink to="/">
                <FaChevronLeft />
                <span>Voltar</span>
              </NavLink>

              <a href={issue.html_url}>
                <span>Ver no github</span>
                <FaShareSquare />
              </a>
            </nav>
            <IssueTitle>{issue.title}</IssueTitle>

            <IssueSecondaryInfo>
              <div>
                <FaGithub size={16} />
                <span>{username}</span>
              </div>
              <div>
                <FaCalendarAlt size={16} />
                <span>{dateToNow}</span>
              </div>
              <div>
                <FaComment size={16} />
                <span>
                  {issue.comments}
                  {issue.comments === 1 && ' comentário'}
                  {issue.comments !== 1 && ' comentários'}
                </span>
              </div>
            </IssueSecondaryInfo>
          </IssueCardInfo>

          <IssueContent>
            {bodyContent.map((content) => {
              return (
                <div key={content}>
                  <p>{content}</p>
                </div>
              )
            })}
          </IssueContent>
        </>
      )}
    </IssuePrincipalCardContainer>
  )
}
