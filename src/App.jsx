import { Routes, Route } from 'react-router-dom'
import NavBar from './components/common/NavBar'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Planner from './pages/Planner'
import Shopping from './pages/Shopping'
import CookingMode from './pages/CookingMode'
import Settings from './pages/Settings'
import AddRecipe from './pages/AddRecipe'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/new" element={<AddRecipe />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/cooking" element={<CookingMode />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <NavBar />
    </>
  )
}
