"use client"

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/30 px-6 py-3 rounded-lg border border-red-400">
          <h2 className="text-red-100 font-bold text-center">
            Ocorreu um erro inesperado. Por favor, recarregue a página.
          </h2>
        </div>
      )
    }

    return this.props.children
  }
}