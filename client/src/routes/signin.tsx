import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { KeyRoundIcon, MailIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ErrorAlert, SubmitButton } from '@/components/Auth'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/signin')({
  component: SigninPage,
})

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

const INITIAL_FORM_DATA: FormData = {
  email: '',
  password: '',
}

function SigninPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  // Redirect authenticated users
  useEffect(() => {
    if (session) {
      router.navigate({ to: '/todos' })
    }
  }, [session, router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear field-specific error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      })
      router.navigate({ to: '/todos' })
    } catch (err) {
      console.error('Signin failed:', err)
      setErrors({
        general: 'Invalid email or password. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderFormField = (
    field: keyof FormData,
    type: string,
    placeholder: string,
    icon: React.ReactNode,
    extraProps?: Record<string, any>,
  ) => (
    <div className="mt-3 first:mt-0">
      <label
        className={`input validator ${errors[field] ? 'input-error' : ''}`}
      >
        {icon}
        <input
          id={field}
          type={type}
          placeholder={placeholder}
          required
          value={formData[field]}
          onChange={handleInputChange(field)}
          disabled={loading}
          {...extraProps}
        />
      </label>
      {errors[field] && (
        <p className="text-error text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  )

  if (session) {
    return null
  }

  return (
    <div className="flex items-center justify-center bg-base-100 pt-12">
      <div className="card bg-base-300 max-w-md">
        <div className="card-body p-8">
          <div className="card-title text-3xl px-4">Sign In</div>
          <p className="text-base-content/70 my-2 text-center">
            Access your account
          </p>

          {errors.general && <ErrorAlert message={errors.general} />}

          <form onSubmit={handleSubmit} noValidate>
            {renderFormField('email', 'email', 'mail@site.com', <MailIcon />)}

            {renderFormField(
              'password',
              'password',
              'Password',
              <KeyRoundIcon />,
            )}

            <SubmitButton
              loading={loading}
              foregroundText="Sign In"
              loadingText="Signing In..."
            />

            <div className="mt-6 text-center">
              <p className="text-base-content/70">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="link link-primary">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
