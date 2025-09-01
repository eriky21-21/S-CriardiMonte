// app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('criar')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Studio de Vídeos</h1>
        </div>
      </header>

      {/* Abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('criar')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'criar'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`} // ← cursor-pointer aqui
          >
            Criar Vídeo
          </button>
          <button
            onClick={() => setActiveTab('modelos')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'modelos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`} // ← cursor-pointer aqui
          >
            Meus Modelos
          </button>
          <button
            onClick={() => setActiveTab('ideias')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'ideias'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`} // ← cursor-pointer aqui
          >
            Ideias
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div className="mt-6">
          {activeTab === 'criar' && <CriarVideoTab />}
          {activeTab === 'modelos' && <ModelosTab />}
          {activeTab === 'ideias' && <IdeiasTab />}
        </div>
      </div>
    </div>
  )
}

// Componente para a aba de Criar Vídeo
function CriarVideoTab() {
  const [texto, setTexto] = useState('')
  const [gerando, setGerando] = useState(false)

  const gerarVideo = async () => {
    setGerando(true)
    // Lógica para gerar vídeo baseado no texto
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulação
    setGerando(false)
    alert('Vídeo gerado com sucesso!')
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descreva o vídeo que você quer:
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Um vídeo motivacional com paisagens naturais e texto inspirador..."
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={gerarVideo}
          disabled={gerando || !texto.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" // ← cursor-pointer
        >
          {gerando ? 'Gerando...' : 'Gerar Vídeo Automaticamente'}
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"> {/* ← cursor-pointer */}
          Upload de Mídia
        </button>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 cursor-pointer"> {/* ← cursor-pointer */}
          Salvar como Modelo
        </button>
      </div>
    </div>
  )
}

// Componente para a aba de Modelos
function ModelosTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Modelos Salvos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Lista de modelos virá aqui */}
        <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"> {/* ← cursor-pointer */}
          <h4 className="font-medium">Modelo Motivacional</h4>
          <p className="text-sm text-gray-600">Última edição: 12/12/2023</p>
        </div>
      </div>
    </div>
  )
}

// Componente para a aba de Ideias
function IdeiasTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Upload para Ideias</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          id="upload-ideia"
        />
        <label
          htmlFor="upload-ideia"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer" // ← cursor-pointer
        >
          Fazer Upload de Imagem/Vídeo
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Faça upload de conteúdo para inspirar seus vídeos
        </p>
      </div>
    </div>
  )
}
