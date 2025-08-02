// 'use client';
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable"
// import React, { useState, useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Textarea } from '@/components/ui/textarea';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import {
//   Play,
//   Sun,
//   Moon,
//   Maximize2,
//   Minus,
//   Plus,
//   Terminal,
//   Code,
//   X,
// } from 'lucide-react';
// import { Editor } from '@monaco-editor/react';

// const PythonCompiler: React.FC = () => {
//   const [code, setCode] = useState(`# Write your Python code here
// # This example demonstrates user input and string manipulation`);
//   const [inputs, setInputs] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [isRunning, setIsRunning] = useState(false);
//   const [showInputBox, setShowInputBox] = useState(false);
//   const [fontSize, setFontSize] = useState(14);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [showConsole, setShowConsole] = useState(false); // Changed to false for mobile
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
//   const [activeTab, setActiveTab] = useState<'code' | 'console'>('code'); // For mobile tabs

//   // Detect input() usage
//   const hasInputCalls = useMemo(() => {
//     const inputRegex = /input\s*\(/g;
//     return inputRegex.test(code);
//   }, [code]);

//   // Extract "input(...)" prompts
//   const getInputPrompts = useMemo(() => {
//     const prompts: string[] = [];
//     const inputRegex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
//     let match;
//     while ((match = inputRegex.exec(code)) !== null) {
//       prompts.push(match[1]);
//     }
//     return prompts;
//   }, [code]);

//   // Count total input() calls
//   const inputCallsCount = useMemo(() => {
//     const matches = code.match(/input\s*\(/g);
//     return matches ? matches.length : 0;
//   }, [code]);

//   // Validate if enough inputs
//   const validateInputs = () => {
//     if (!hasInputCalls) return true;
//     const inputLines = inputs.trim().split('\n').filter(line => line.trim() !== '');
//     return inputLines.length >= inputCallsCount;
//   };

//   const handleRunCode = () => {
//     setOutput('');
//     setError('');
//     if (hasInputCalls) {
//       setShowInputBox(true);
//       setShowConsole(true);
//       setActiveTab('console'); // Switch to console tab on mobile
//     } else {
//       sendCodeAndInputs();
//     }
//   };

//   const sendCodeAndInputs = async () => {
//     if (hasInputCalls && !validateInputs()) {
//       setError(
//         `Input Error: Expected ${inputCallsCount} inputs, but only ${inputs
//           .trim()
//           .split('\n')
//           .filter(line => line.trim() !== '').length
//         } provided.`
//       );
//       return;
//     }
//     setIsRunning(true);
//     setOutput('');
//     setError('');
//     setShowConsole(true);
//     setActiveTab('console'); // Switch to console tab on mobile

//     try {
//       const response = await fetch('http://localhost:8000/run-python', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           code: code,
//           inputs: inputs,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setOutput(data.output || 'Code executed successfully (no output)');
//     } catch (error) {
//       console.error('Error executing code:', error);
//       setError(
//         `Execution Error: ${error instanceof Error ? error.message : 'Unknown error occurred'
//         }`
//       );
//     } finally {
//       setIsRunning(false);
//       setShowInputBox(false);
//     }
//   };

//   const clearOutput = () => {
//     setOutput('');
//     setError('');
//     setShowInputBox(false);
//     setInputs('');
//   };

//   // Test backend connection
//   const testBackendConnection = async () => {
//     try {
//       const response = await fetch('http://localhost:8000');
//       if (response.ok) {
//         setBackendStatus('connected');
//         setError('');
//       } else {
//         setBackendStatus('disconnected');
//         setError('Backend server is not responding properly');
//       }
//     } catch (error) {
//       console.log(error)
//       setBackendStatus('disconnected');
//       setError('Cannot connect to backend server. Please ensure the server is running on port 8000.');
//     }
//   };

//   React.useEffect(() => {
//     testBackendConnection();
//   }, []);

//   return (
//     <div className="h-screen bg-background flex flex-col overflow-hidden">
//       {/* Mobile Layout - Tabs for screens smaller than lg */}
//       <div className="lg:hidden flex-1 flex flex-col">
//         {/* Mobile Header */}
//         <div className="bg-background border-b p-2">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center space-x-2">
//               <div className="text-sm font-medium text-muted-foreground">main.py</div>
//               {hasInputCalls && (
//                 <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                   Needs Input
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center space-x-1">
//               <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
//                 {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//               </Button>
//               <div className="flex items-center space-x-1 border rounded">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setFontSize(Math.max(10, fontSize - 1))}
//                   className="h-7 w-7 p-0"
//                 >
//                   <Minus className="h-3 w-3" />
//                 </Button>
//                 <span className="text-xs px-1 min-w-[20px] text-center">{fontSize}</span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setFontSize(Math.min(24, fontSize + 1))}
//                   className="h-7 w-7 p-0"
//                 >
//                   <Plus className="h-3 w-3" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Tab Navigation */}
//           <div className="flex space-x-1">
//             <Button
//               variant={activeTab === 'code' ? 'default' : 'ghost'}
//               size="sm"
//               onClick={() => setActiveTab('code')}
//               className="flex-1"
//             >
//               <Code className="h-4 w-4 mr-1" />
//               Code
//             </Button>
//             <Button
//               variant={activeTab === 'console' ? 'default' : 'ghost'}
//               size="sm"
//               onClick={() => setActiveTab('console')}
//               className="flex-1"
//             >
//               <Terminal className="h-4 w-4 mr-1" />
//               Console
//               {(output || error || showInputBox) && (
//                 <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Run Button */}
//         <div className="bg-background border-b p-2">
//           <Button
//             onClick={handleRunCode}
//             disabled={isRunning}
//             className="w-full"
//             size="sm"
//           >
//             <Play className="h-4 w-4 mr-2" />
//             {isRunning ? 'Running...' : 'Run Code'}
//           </Button>
//         </div>

//         {/* Mobile Content Area */}
//         <div className="flex-1 relative">
//           {/* Code Tab - Mobile */}
//           {activeTab === 'code' && (
//             <div className="absolute inset-0">
//               <Editor
//                 height="100%"
//                 defaultLanguage="python"
//                 value={code}
//                 theme={isDarkMode ? 'vs-dark' : 'vs'}
//                 options={{
//                   fontSize: fontSize,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   wordWrap: 'on',
//                   lineNumbers: 'on',
//                   automaticLayout: true,
//                   padding: { top: 16, bottom: 16 },
//                   fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
//                   renderLineHighlight: 'gutter',
//                   selectionHighlight: true,
//                   contextmenu: true,
//                   copyWithSyntaxHighlighting: true,
//                   formatOnPaste: true,
//                   formatOnType: true,
//                   suggest: {
//                     showKeywords: true,
//                     showSnippets: true,
//                   },
//                   quickSuggestions: {
//                     other: true,
//                     comments: false,
//                     strings: false,
//                   },
//                 }}
//                 onChange={(value) => setCode(value || '')}
//               />
//             </div>
//           )}

//           {/* Console Tab - Mobile */}
//           {activeTab === 'console' && (
//             <div className="absolute inset-0 flex flex-col">
//               <div className="flex-1 overflow-auto p-4">
//                 {showInputBox && hasInputCalls && (
//                   <Card className="mb-4">
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <label className="text-sm font-medium">
//                           Program Inputs ({inputCallsCount} needed):
//                         </label>
//                         <Button
//                           onClick={() => setShowInputBox(false)}
//                           variant="ghost"
//                           size="sm"
//                           disabled={isRunning}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
                      
//                       {getInputPrompts.length > 0 && (
//                         <div className="bg-muted rounded-md p-3 mb-3">
//                           <div className="text-xs font-medium text-muted-foreground mb-2">
//                             Input prompts in order:
//                           </div>
//                           <ol className="text-xs text-foreground list-decimal ml-4">
//                             {getInputPrompts.map((prompt, idx) => (
//                               <li key={idx} className="font-mono mb-1">
//                                 {prompt}
//                               </li>
//                             ))}
//                           </ol>
//                         </div>
//                       )}

//                       <Textarea
//                         value={inputs}
//                         onChange={e => setInputs(e.target.value)}
//                         className="mb-3 font-mono text-sm"
//                         placeholder="Enter inputs (one per line)"
//                         rows={3}
//                       />

//                       {!validateInputs() && inputs.trim() && (
//                         <Alert variant="destructive" className="mb-3">
//                           <AlertDescription className="text-sm">
//                             Expected {inputCallsCount} inputs, got{' '}
//                             {
//                               inputs
//                                 .trim()
//                                 .split('\n')
//                                 .filter(line => line.trim() !== '').length
//                             }
//                           </AlertDescription>
//                         </Alert>
//                       )}

//                       <div className="flex gap-2">
//                         <Button
//                           onClick={sendCodeAndInputs}
//                           disabled={isRunning || !validateInputs()}
//                           size="sm"
//                           className="flex-1"
//                         >
//                           {isRunning ? 'Running...' : 'Execute'}
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* Output Section - Mobile */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm font-medium text-muted-foreground">
//                       Output
//                     </div>
//                     <Button onClick={clearOutput} variant="outline" size="sm">
//                       Clear
//                     </Button>
//                   </div>

//                   {error && (
//                     <Alert variant="destructive">
//                       <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
//                         {error}
//                       </AlertDescription>
//                     </Alert>
//                   )}

//                   {output && (
//                     <div className="border border-muted rounded-md bg-background p-4 font-mono text-sm whitespace-pre-wrap text-foreground shadow-sm">
//                       {output}
//                       <p className='pt-4 text-muted-foreground text-xs'>
//                         === Code Execution Successful ===
//                       </p>
//                     </div>
//                   )}

//                   {!output && !error && !isRunning && !showInputBox && (
//                     <div className="text-muted-foreground text-center py-12 flex flex-col items-center">
//                       <div className="text-4xl mb-4">▷</div>
//                       <p className="text-sm mb-2">Click &rdquo;Run Code&rdquo; to execute</p>
//                       <p className="text-xs text-muted-foreground">
//                         Practice your coding skills with PrepFlow
//                       </p>
//                       {hasInputCalls && (
//                         <p className="text-xs mt-2 text-blue-600">
//                           This code requires inputs
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {isRunning && (
//                     <div className="text-blue-600 text-center py-12 flex flex-col items-center">
//                       <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mb-4" />
//                       <p className="text-sm">Executing Python code...</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Desktop Layout - Resizable panels for lg+ screens */}
//       <div className="hidden lg:block flex-1">
//         <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
//           {/* Code Editor Panel - Desktop */}
//           <ResizablePanel defaultSize={68} minSize={32} maxSize={90}>
//             <div className="h-full p-4">
//               <Card className="h-full bg-background shadow-sm rounded-lg">
//                 {/* Desktop File Tab */}
//                 <div className="flex items-center justify-between border-b border-muted px-4 py-2 bg-background rounded-t-lg">
//                   <div className="flex items-center space-x-2">
//                     <div className="flex items-center space-x-1">
//                       <div className="w-3 h-3 bg-red-500 rounded-full" />
//                       <div className="w-3 h-3 bg-yellow-500 rounded-full" />
//                       <div className="w-3 h-3 bg-green-500 rounded-full" />
//                     </div>
//                     <div className="ml-4 text-sm font-medium text-muted-foreground">main.py</div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <select className="text-sm border rounded px-2 py-1 bg-background">
//                       <option>Python</option>
//                     </select>
//                     <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
//                       {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//                     </Button>
//                     <Button variant="ghost" size="sm">
//                       <Maximize2 className="h-4 w-4" />
//                     </Button>
//                     <div className="flex items-center space-x-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setFontSize(Math.max(10, fontSize - 1))}
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="text-sm px-2">{fontSize}</span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setFontSize(Math.min(24, fontSize + 1))}
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <Button
//                       onClick={handleRunCode}
//                       disabled={isRunning}
//                       size="sm"
//                     >
//                       <Play className="h-4 w-4 mr-2" />
//                       Run
//                     </Button>
//                   </div>
//                 </div>
//                 {/* Code Editor Area - Desktop */}
//                 <CardContent className="flex-1 p-0 h-[calc(100%-60px)]">
//                   <div className="h-full">
//                     <Editor
//                       height="100%"
//                       defaultLanguage="python"
//                       value={code}
//                       theme={isDarkMode ? 'vs-dark' : 'vs'}
//                       options={{
//                         fontSize: fontSize,
//                         minimap: { enabled: false },
//                         scrollBeyondLastLine: false,
//                         wordWrap: 'on',
//                         lineNumbers: 'on',
//                         automaticLayout: true,
//                         padding: { top: 16, bottom: 16 },
//                         fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
//                         renderLineHighlight: 'gutter',
//                         selectionHighlight: true,
//                         contextmenu: true,
//                         copyWithSyntaxHighlighting: true,
//                         formatOnPaste: true,
//                         formatOnType: true,
//                         suggest: {
//                           showKeywords: true,
//                           showSnippets: true,
//                         },
//                         quickSuggestions: {
//                           other: true,
//                           comments: false,
//                           strings: false,
//                         },
//                       }}
//                       onChange={(value) => setCode(value || '')}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </ResizablePanel>

//           <ResizableHandle withHandle className="border-muted" />

//           {/* Console Panel - Desktop */}
//           <ResizablePanel defaultSize={32} minSize={20} maxSize={68}>
//             <div className="h-full p-4 pl-0">
//               <Card className="h-full bg-background shadow-sm rounded-lg">
//                 <div className="border-b border-muted px-4 py-3 bg-background rounded-t-lg">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <div className="text-sm font-medium text-foreground">Console</div>
//                     </div>
//                     <Button onClick={clearOutput} variant="secondary" size="sm">
//                       Clear
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Console Output Panel - Desktop */}
//                 <CardContent className="flex-1 flex flex-col h-[calc(100%-60px)] p-0">
//                   {showInputBox && hasInputCalls && (
//                     <div className="p-4 border-b bg-background">
//                       <div className="flex items-center justify-between mb-2">
//                         <label className="text-sm font-medium text-foreground">
//                           Program Inputs ({inputCallsCount} needed):
//                         </label>
//                       </div>
//                       {getInputPrompts.length > 0 && (
//                         <div className="bg-muted border border-muted rounded-md p-3 mb-3">
//                           <div className="text-xs font-medium text-muted-foreground mb-2">
//                             Input prompts in order:
//                           </div>
//                           <ol className="text-xs text-foreground list-decimal ml-4">
//                             {getInputPrompts.map((prompt, idx) => (
//                               <li key={idx} className="font-mono mb-1">
//                                 {prompt}
//                               </li>
//                             ))}
//                           </ol>
//                         </div>
//                       )}

//                       <Textarea
//                         value={inputs}
//                         onChange={e => setInputs(e.target.value)}
//                         className="mb-3 font-mono text-sm"
//                         placeholder="Enter inputs (one per line)"
//                         rows={3}
//                       />

//                       {!validateInputs() && inputs.trim() && (
//                         <Alert variant="destructive" className="mb-3">
//                           <AlertDescription className="text-sm">
//                             Expected {inputCallsCount} inputs, got{' '}
//                             {
//                               inputs
//                                 .trim()
//                                 .split('\n')
//                                 .filter(line => line.trim() !== '').length
//                             }
//                           </AlertDescription>
//                         </Alert>
//                       )}

//                       <div className="flex gap-2">
//                         <Button
//                           onClick={sendCodeAndInputs}
//                           disabled={isRunning || !validateInputs()}
//                           size="sm"
//                         >
//                           {isRunning ? 'Running...' : 'Execute'}
//                         </Button>
//                         <Button
//                           onClick={() => setShowInputBox(false)}
//                           variant="outline"
//                           size="sm"
//                           disabled={isRunning}
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Output/Status/Error Panel - Desktop */}
//                   <div className="flex-1 p-4">
//                     <div className="text-sm font-medium text-muted-foreground mb-2">
//                       Output
//                     </div>
//                     <div className="flex-1 min-h-0">
//                       {error && (
//                         <Alert variant="destructive" className="mb-4">
//                           <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
//                             {error}
//                           </AlertDescription>
//                         </Alert>
//                       )}

//                       {output && (
//                         <div className="border border-muted rounded-md bg-background p-4 font-mono text-sm whitespace-pre-wrap text-foreground shadow-sm">
//                           {output}
//                           <p className='pt-10 text-muted-foreground'>=== Code Execution Successful ===</p>
//                         </div>
//                       )}

//                       {!output && !error && !isRunning && !showInputBox && (
//                         <div className="text-muted-foreground text-center py-12 flex flex-col items-center">
//                           <div className="text-4xl mb-4">▷</div>
//                           <p className="text-sm">Click &rdquo;Run&rdquo; to execute your code</p>
//                           <p className="text-xs mt-2 text-muted-foreground">
//                             Practice your coding skills with PrepFlow
//                           </p>
//                           {hasInputCalls && (
//                             <p className="text-xs mt-2 text-blue-600">
//                               This code requires inputs
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       {isRunning && (
//                         <div className="text-blue-600 text-center py-12 flex flex-col items-center">
//                           <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mb-4" />
//                           <p className="text-sm">Executing Python code...</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </div>
//   );
// };

// export default PythonCompiler;
