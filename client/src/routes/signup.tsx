import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { KeyRoundIcon, MailIcon, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ErrorAlert, SubmitButton } from '@/components/Auth'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[A-Za-z][A-Za-z\-]*$/,
    message: '3 to 30 characters, only letters or dashes',
  },
  password: {
    minLength: 8,
    message: 'Must be at least 8 characters long',
  },
}

function SignupPage() {
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

    // Validate name
    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (!VALIDATION_RULES.name.pattern.test(formData.name)) {
      newErrors.name = VALIDATION_RULES.name.message
    } else if (
      formData.name.length < VALIDATION_RULES.name.minLength ||
      formData.name.length > VALIDATION_RULES.name.maxLength
    ) {
      newErrors.name = VALIDATION_RULES.name.message
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < VALIDATION_RULES.password.minLength) {
      newErrors.password = VALIDATION_RULES.password.message
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      router.navigate({ to: '/todos' })
    } catch (err) {
      console.error('Signup failed:', err)
      setErrors({
        general: 'Failed to create account. Please try again.',
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

  // Don't render anything while checking session
  if (session) {
    return null
  }

  return (
    <div className="flex items-center justify-center bg-base-100 pt-12">
      <div className="card bg-base-300 max-w-md">
        <div className="card-body p-8">
          <div className="card-title text-3xl px-4">Create an Account</div>
          <p className="text-base-content/70 my-2 text-center">
            Sign up to get started
          </p>

          {errors.general && <ErrorAlert message={errors.general} />}
          {errors.confirmPassword && (
            <ErrorAlert message={errors.confirmPassword} />
          )}

          <form onSubmit={handleSubmit} noValidate>
            {renderFormField('name', 'text', 'Full Name', <UserIcon />, {
              minLength: VALIDATION_RULES.name.minLength,
              maxLength: VALIDATION_RULES.name.maxLength,
            })}

            {renderFormField('email', 'email', 'mail@site.com', <MailIcon />)}

            {renderFormField(
              'password',
              'password',
              'Password',
              <KeyRoundIcon />,
              {
                minLength: VALIDATION_RULES.password.minLength,
              },
            )}

            {renderFormField(
              'confirmPassword',
              'password',
              'Confirm Password',
              <KeyRoundIcon />,
              {
                minLength: VALIDATION_RULES.password.minLength,
              },
            )}

            <SubmitButton
              loading={loading}
              foregroundText="Sign Up"
              loadingText="Creating account..."
            />

            <div className="mt-6 text-center">
              <p className="text-base-content/70">
                Already have an account?{' '}
                <Link to="/signin" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
