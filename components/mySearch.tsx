import React, { useRef, useEffect } from 'react';

// Helper function to escape special regex characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const initialState = {
  loading: false,
  results: [],
  value: '',
  showResults: false,
}

function searchReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query, showResults: true }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection, showResults: false }
    case 'HIDE_RESULTS':
      return { ...state, showResults: false }
    default:
      throw new Error()
  }
}

export default function MySearch({ items, openItem, type }: {
  items: any[],
  openItem: any,
  type: string
}) {
  const [state, dispatch] = React.useReducer(searchReducer, initialState)
  const { loading, results, value, showResults } = state
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        dispatch({ type: 'HIDE_RESULTS' })
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    dispatch({ type: 'START_SEARCH', query })

    setTimeout(() => {
      if (query.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(escapeRegExp(query), 'i')
      const isMatch = (result) => re.test(result.data.name)

      dispatch({
        type: 'FINISH_SEARCH',
        results: items.filter(isMatch),
      })
    }, 300)
  }

  const handleResultClick = (item: any) => {
    openItem(item.data)
    dispatch({ type: 'UPDATE_SELECTION', selection: item.data.name })
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder={`Search ${type}`}
          value={value}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 text-base rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => handleResultClick(item)}
              className="group px-4 py-3 hover:bg-secondary cursor-pointer border-b border-border last:border-b-0 transition-colors duration-200"
            >
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.data.name}
              </div>
              {item.data.tagline && (
                <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {item.data.tagline}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showResults && value && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg p-4">
          <div className="text-center text-muted-foreground">
            No results found for &quot;{value}&quot;
          </div>
        </div>
      )}
    </div>
  )
}
