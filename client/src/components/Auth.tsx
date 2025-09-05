import { CircleX } from 'lucide-react'

function ErrorAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="alert alert-error">
      <CircleX />
      <span>Error: {message}</span>
    </div>
  )
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <div className="card-actions mt-4">
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm text-primary"></span>
            <span className="ml-2 text-primary">Creating account...</span>
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </div>
  )
}

export { ErrorAlert, SubmitButton }
