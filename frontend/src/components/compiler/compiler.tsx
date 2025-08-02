'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MobileHeader from "./mobileHeader";
import MobileContent from "./mobileContent";
import DesktopCodeEditor from "./DesktopCodeEditor";
import { Play } from "lucide-react";
import DesktopConsole from "./DesktopConsole";

const PythonCompiler: React.FC = () => {
  const [code, setCode] = useState(`# Write your Python code here`);
  const [inputs, setInputs] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [activeTab, setActiveTab] = useState<'code' | 'console'>('code');

  // Detect input() usage
  const hasInputCalls = useMemo(() => {
    const inputRegex = /input\s*\(/g;
    return inputRegex.test(code);
  }, [code]);

  // Extract "input(...)" prompts
  const getInputPrompts = useMemo(() => {
    const prompts: string[] = [];
    const inputRegex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
    let match;
    while ((match = inputRegex.exec(code)) !== null) {
      prompts.push(match[1]);
    }
    return prompts;
  }, [code]);

  // Count total input() calls
  const inputCallsCount = useMemo(() => {
    const matches = code.match(/input\s*\(/g);
    return matches ? matches.length : 0;
  }, [code]);

  // Validate if enough inputs
  const validateInputs = () => {
    if (!hasInputCalls) return true;
    const inputLines = inputs.trim().split('\n').filter(line => line.trim() !== '');
    return inputLines.length >= inputCallsCount;
  };

  const handleRunCode = () => {
    setOutput('');
    setError('');
    if (hasInputCalls) {
      setShowInputBox(true);
      setActiveTab('console'); 
    } else {
      sendCodeAndInputs();
    }
  };

  const sendCodeAndInputs = async () => {
    if (hasInputCalls && !validateInputs()) {
      setError(
        `Input Error: Expected ${inputCallsCount} inputs, but only ${inputs
          .trim()
          .split('\n')
          .filter(line => line.trim() !== '').length
        } provided.`
      );
      return;
    }
    setIsRunning(true);
    setOutput('');
    setError('');
    setActiveTab('console');

    try {
      const response = await fetch('https://online-compiler-by-bharani.onrender.com/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          inputs: inputs,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.output || 'Code executed successfully (no output)');
    } catch (error) {
      console.error('Error executing code:', error);
      setError(
        `Execution Error: ${error instanceof Error ? error.message : 'Unknown error occurred'
        }`
      );
    } finally {
      setIsRunning(false);
      setShowInputBox(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setError('');
    setShowInputBox(false);
    setInputs('');
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch('https://online-compiler-by-bharani.onrender.com');
      if (response.ok) {
        setBackendStatus('connected');
        setError('');
      } else {
        setBackendStatus('disconnected');
        setError('Backend server is not responding properly');
      }
    } catch (error) {
      console.log(error)
      setBackendStatus('disconnected');
      setError('Cannot connect to backend server. Please ensure it is running.');
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile Layout - Tabs for screens smaller than lg */}
      <div className="lg:hidden flex-1 flex flex-col">
        <MobileHeader
          hasInputCalls={hasInputCalls}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          activeTab={activeTab}
          setShowInputBox={setShowInputBox}
          showInputBox={showInputBox}
          fontSize={fontSize}
          setFontSize={setFontSize}
          output={output}
          error={error}
          setActiveTab={setActiveTab}
        />

        <div className="bg-background border-b p-2">
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="w-full"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>

        <MobileContent
          activeTab={activeTab}
          code={code}
          setCode={setCode}
          isDarkMode={isDarkMode}
          fontSize={fontSize}
          showInputBox={showInputBox}
          setShowInputBox={setShowInputBox}
          hasInputCalls={hasInputCalls}
          inputCallsCount={inputCallsCount}
          getInputPrompts={getInputPrompts}
          inputs={inputs}
          setInputs={setInputs}
          isRunning={isRunning}
          sendCodeAndInputs={sendCodeAndInputs}
          validateInputs={validateInputs}
          clearOutput={clearOutput}
          error={error}
          output={output}
        />
      </div>

      {/* Desktop Layout - Resizable panels for lg+ screens */}
      <div className="hidden lg:block flex-1">
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full" >

          <ResizablePanel defaultSize={68} minSize={32} maxSize={90}>
            <DesktopCodeEditor
              code={code}
              setCode={setCode}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              fontSize={fontSize}
              setFontSize={setFontSize}
              handleRunCode={handleRunCode}
              isRunning={isRunning}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="border-muted" />
          <ResizablePanel defaultSize={32} minSize={20} maxSize={68}>
            <DesktopConsole
              showInputBox={showInputBox}
              hasInputCalls={hasInputCalls}
              inputCallsCount={inputCallsCount}
              getInputPrompts={getInputPrompts}
              inputs={inputs}
              setInputs={setInputs}
              isRunning={isRunning}
              sendCodeAndInputs={sendCodeAndInputs}
              validateInputs={validateInputs}
              setShowInputBox={setShowInputBox}
              clearOutput={clearOutput}
              error={error}
              output={output}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PythonCompiler;
