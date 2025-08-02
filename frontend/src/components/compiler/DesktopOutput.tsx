"use client";

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DesktopOutputProps {
    error: string;
    output: string;
    isRunning: boolean;
    showInputBox: boolean;
    hasInputCalls: boolean;
}

export default function DesktopOutput({
    error,
    output,
    isRunning,
    showInputBox,
    hasInputCalls,
}: DesktopOutputProps) {
    return (
        <div className="flex-1 p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">
                Output
            </div>
            <div className="flex-1 min-h-0">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {output && (
                    <div className="border border-muted rounded-md bg-background p-4 font-mono text-sm whitespace-pre-wrap text-foreground shadow-sm">
                        {output}
                        <p className='pt-10 text-muted-foreground'>=== Code Execution Successful ===</p>
                    </div>
                )}

                {!output && !error && !isRunning && !showInputBox && (
                    <div className="text-muted-foreground text-center py-12 flex flex-col items-center">
                        <div className="text-4xl mb-4">▷</div>
                        <p className="text-sm">Click &rdquo;Run&rdquo; to execute your code</p>
                        <p className="text-xs mt-2 text-muted-foreground">
                            Practice your coding skills with PrepFlow
                        </p>
                        {hasInputCalls && (
                            <p className="text-xs mt-2 text-blue-600">
                                This code requires inputs
                            </p>
                        )}
                    </div>
                )}

                {isRunning && (
                    <div className="text-blue-600 text-center py-12 flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mb-4" />
                        <p className="text-sm">Executing Python code...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
